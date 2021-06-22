import {Container, Sprite} from "pixi.js";
import {IIconData} from "./_types/IIconData";

export class Icon extends Container {
    /**
     * Creates a new icon
     * @param config The configuration for the icon
     */
    public constructor({texture, color, size, pos}: IIconData) {
        super();
        const sprite = new Sprite(texture);
        this.addChild(sprite);
        sprite.tint = color;
        sprite.width = size;
        sprite.height = size;
        sprite.x = pos.x;
        sprite.y = pos.y;
        sprite.anchor.x = 0.5;
        sprite.anchor.y = 0.5;
    }
}
