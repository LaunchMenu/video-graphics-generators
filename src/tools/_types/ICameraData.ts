import {Container} from "pixi.js";
import {IPoint} from "../../animations/servicesGraph/_types/IPoint";
import {IEase} from "./IEase";

export type ICameraData<T extends ICameraPaths> = {
    target: Container;
    size: {
        width: number;
        height: number;
    };
    paths: T;
};

export type ICameraPaths = Record<string, ICameraPath>;

export type ICameraPath = ICameraPointPath | ICameraTargetPath;

export type ICameraTargetPath = {
    targets: ICameraTarget[];
};

export type ICameraPointPath = {
    points: ICameraTransform[];
    duration?: number;
    speed?: number;
    easing?: IEase;
};

export type ICameraTarget = {
    target: {
        point: IPoint;
    };
    duration: number;
    zoom?: number;
    angle?: number;
};

export type ICameraTransform = {
    x: number;
    y: number;
    angle?: number;
    zoom?: number;
};
