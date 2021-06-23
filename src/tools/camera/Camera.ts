import {Container} from "pixi.js";
import {AnimationContainer} from "../animatables/AnimationContainer";
import {IAnimatable} from "../_types/IAnimatable";
import {ICameraData, ICameraTransform} from "../_types/ICameraData";

export class Camera extends AnimationContainer {
    public controller: IAnimatable | undefined;

    protected target: Container;
    protected size: {width: number; height: number};

    protected transf: ICameraTransform;

    /**
     * Creates a new camera
     * @param config The configuration for the camera
     */
    public constructor({target, size}: ICameraData) {
        super();
        this.target = target;
        this.size = size;

        this.target.x = this.size.width / 2;
        this.target.y = this.size.height / 2;

        this.target.pivot.x = this.size.width / 2;
        this.target.pivot.y = this.size.height / 2;

        this.transf = {
            x: this.target.x,
            y: this.target.y,
        };
    }

    /**
     * Takes a single step
     * @param delta The delta of passed time
     */
    public async step(delta: number): Promise<boolean> {
        const controllerRes = await this.controller?.step(delta);
        const controllerDone = this.controller
            ? controllerRes == undefined
                ? false
                : controllerRes
            : true;

        const childrenDone = await super.step(delta);
        return controllerDone && childrenDone;
    }

    /**
     * Sets the position of the camera
     * @param transform The transformation to set
     */
    public setPosition(transform: ICameraTransform): void {
        this.target.pivot.x = transform.x;
        this.target.pivot.y = transform.y;

        if (transform.zoom) {
            this.target.scale.x = transform.zoom;
            this.target.scale.y = transform.zoom;
        }
        if (transform.angle) this.target.angle = -transform.angle;

        this.transf = transform;
    }
    /**
     * Sets a controller that manages the movement of the camera
     * @param controller The controller to be set
     */
    public setController(controller: IAnimatable): void {
        this.controller = controller;
    }

    /**
     * Retrieves the position of the camera
     * @returns The camera transform
     */
    public getPosition() {
        return {
            zoom: 1,
            angle: 0,
            ...this.transf,
        };
    }
}
