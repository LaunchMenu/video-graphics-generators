import vertex from "./vertex.vert";
import fragment from "./fragment.frag";
import {Filter, FilterSystem, RenderTexture} from "@pixi/core";
import {ILineFilterData} from "./_types/ILineFilterData";
import {CLEAR_MODES} from "@pixi/constants";
import {BlurFilterPass} from "./blurPass/BlurFilterPass";
import {settings} from "pixi.js";
import {hex2rgb, rgb2hex} from "@pixi/utils";

// Source: https://github.com/pixijs/filters

export class LineFilter extends Filter {
    protected blurXFilter: BlurFilterPass;
    protected blurYFilter: BlurFilterPass;
    protected _color: number;

    /**
     * Creates a new line filter
     * @param options The options for the filter
     */
    constructor(options: ILineFilterData) {
        super(vertex, fragment);

        this.uniforms.highlightColor = new Float32Array(3);
        this.color = options.color;

        const strength = options.blurStrength;
        const quality = options.blurQuality;
        const resolution = settings.FILTER_RESOLUTION;
        const kernelSize = 5;
        this.blurXFilter = new BlurFilterPass(
            true,
            strength,
            quality,
            resolution,
            kernelSize
        );
        this.blurYFilter = new BlurFilterPass(
            false,
            strength,
            quality,
            resolution,
            kernelSize
        );

        // Workaround: https://github.com/pixijs/filters/issues/230
        // applies correctly only if there is at least a single-pixel padding with alpha=0 around an image
        // To solve this problem, a padding of 1 put on the filter should suffice
        this.padding = strength;
    }

    public apply(
        filterManager: FilterSystem,
        input: RenderTexture,
        output: RenderTexture,
        clearMode: CLEAR_MODES
    ): void {
        const partialBlur = filterManager.getFilterTexture();
        const fullBlur = filterManager.getFilterTexture();

        this.uniforms.originalSampler = input;
        this.blurXFilter.apply(filterManager, input, partialBlur, CLEAR_MODES.CLEAR);
        this.blurYFilter.apply(filterManager, partialBlur, fullBlur, CLEAR_MODES.CLEAR);

        super.apply(filterManager, fullBlur, output, clearMode);

        filterManager.returnFilterTexture(partialBlur);
        filterManager.returnFilterTexture(fullBlur);
    }

    set color(value: number) {
        const arr = this.uniforms.highlightColor;

        if (typeof value === "number") {
            hex2rgb(value, arr);
            this._color = value;
        } else {
            arr[0] = value[0];
            arr[1] = value[1];
            arr[2] = value[2];
            this._color = rgb2hex(arr);
        }
    }
    get color(): number {
        return this._color;
    }
}
