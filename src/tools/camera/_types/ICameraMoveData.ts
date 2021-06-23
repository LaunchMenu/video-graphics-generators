import {IPoint} from "../../../animations/servicesGraph/_types/IPoint";
import {IEase} from "../../_types/IEase";
import {Camera} from "../Camera";

export type ICameraMoveData = {
    camera: Camera;
    duration: number;
    point: () => IPoint & {zoom?: number; angle?: number};
    easing?: IEase;
};
