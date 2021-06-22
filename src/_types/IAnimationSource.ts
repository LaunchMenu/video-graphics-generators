import {IAnimation} from "./IAnimation";

export type IAnimationSource = {
    /** The display name of the animation */
    name: string;
    /**
     * Initializes the animation
     * @returns The animation
     */
    init(): Promise<IAnimation> | IAnimation;
};
