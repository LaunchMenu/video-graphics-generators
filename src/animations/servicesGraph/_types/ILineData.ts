import {Camera} from "../../../tools/camera/Camera";
import {IEase} from "../../../tools/_types/IEase";
import {IPoint} from "./IPoint";

export type ILineData = {
    /** The points on the line */
    points: IPoint[];

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

    /** The data animation data */
    data?: {
        /** The number of pixels that the data move per second */
        speed: number;
        /** How long it takes to show the new data */
        showTransDuration: number;
    };
};
