import {DisplayObject} from "pixi.js";

export type IAnimatableInit<T> = IAnimatableInitCore | ((self: T) => IAnimatableInitCore);
export type IAnimatableInitCore = {
    /** The children to be shown */
    children: DisplayObject[];

    /**
     * Updates the state for the next frame to be rendered, if the animatable is active
     * @param delta The time delta
     * @returns Whether the animation finished
     */
    step(delta: number): boolean;

    /**
     * Updates the state for the next frame to be rendered, no matter if the animatable is active
     * @param delta The time delta
     */
    continuousStep?(delta: number): void;
};
