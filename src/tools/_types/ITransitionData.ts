import {DisplayObject} from "pixi.js";
import {IAnimatable} from "./IAnimatable";
import {IEase} from "./IEase";
import {ITransitionType} from "./ITransitionType";

export type ITransitionData = {
    /** The item to be transitioned */
    item: DisplayObject & Partial<IAnimatable>;
    /** The transition duration */
    duration: number;
    /** The easing to use for the transition */
    easing?: IEase;
    /** The transition to use */
    type?: ITransitionType;
};
