import {Container} from "pixi.js";

export type ICameraData = {
    target: Container;
    size: {
        width: number;
        height: number;
    };
};
export type ICameraTransform = {
    x: number;
    y: number;
    angle?: number;
    zoom?: number;
};
