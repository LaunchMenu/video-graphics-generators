import {Texture} from "pixi.js";
import {IPoint} from "./IPoint";

export type IIconData = {
    /** The icon texture */
    texture: Texture;
    /** The color of the icon */
    color: number;
    /** The size of the icon */
    size: number;
    /** The position of the icon within its parent */
    pos: IPoint;
};
