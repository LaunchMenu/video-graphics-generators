import {GUI} from "dat.gui";
import {Container} from "pixi.js";

export type IAnimation = {
    /** The number of frames per second for the animation, defaults to 60 */
    fps?: number;
    /** The resolution of the animation, defaults to 1920*1080 */
    resolution?: {width: number; height: number};
    /** The scene to be shown for the animation */
    scene: Container;
    /**
     * Updates the state for the next frame to be rendered
     * @param delta The time delta
     * @returns Whether the animation finished
     */
    step(delta: number): Promise<boolean | void>;
    /** Additional config options for the animation */
    options?: GUI;
    /** Background color */
    backgroundColor?: number;
};
