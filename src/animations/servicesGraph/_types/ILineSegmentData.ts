import {IEase} from "../../../tools/_types/IEase";
import {IPoint} from "./IPoint";

export type ILineSegmentData = {
    /** The start of the line */
    start: IPoint;
    /** The end of the line */
    end: IPoint;

    /** The color of the line */
    color: number;
    /** The width of the line */
    width: number;

    /** The number of pixels to animate per second */
    speed?: number;
    /** The duration of the line to animate */
    duration?: number;
    /** The easing to use for the animation */
    easing?: IEase;
};
