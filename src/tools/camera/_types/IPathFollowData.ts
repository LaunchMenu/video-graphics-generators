import {ICameraTransform} from "../../_types/ICameraData";
import {IEase} from "../../_types/IEase";
import {Camera} from "../Camera";

export type IPathFollowData = {
    camera: Camera;
    points: ICameraTransform[];
    duration?: number;
    speed?: number;
    easing?: IEase;
};
