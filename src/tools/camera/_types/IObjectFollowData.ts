import {IPoint} from "../../../animations/servicesGraph/_types/IPoint";
import {Camera} from "../Camera";

export type IObjectFollowData = {
    camera: Camera;
    target: {
        point: IPoint;
    };
    duration: number;
    zoom?: number;
    angle?: number;
    offset?: IPoint;
};
