import {Container, Graphics} from "pixi.js";
import {IAnimationSource} from "../../_types/IAnimationSource";

export const testAnimation: IAnimationSource = {
    name: "Test",
    init() {
        const scene = new Container();
        const circle = new Graphics();
        circle.beginFill(0xff0000);
        circle.drawCircle(0, 0, 50);
        circle.endFill();
        scene.addChild(circle);

        console.log(scene);

        return {
            scene,
            step: async () => {
                circle.y += 20;
                if (circle.y > 300) return true;
            },
        };
    },
};
