import {Graphics} from "pixi.js";
import {Animatable} from "../../tools/animatables/Animatable";
import {ease} from "../../tools/ease";
import {ILineSegmentData} from "./_types/ILineSegmentData";

export class LineSegment extends Animatable {
    /**
     * Creates a new line segment
     * @param init The initialization data
     */
    public constructor({
        start,
        end,
        duration,
        speed,
        color,
        width,
        easing = ease.linear,
    }: ILineSegmentData) {
        const graphics = new Graphics();
        const dx = end.x - start.x;
        const dy = end.y - start.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const perSpeed = speed ? speed / distance : (1 / (duration ?? 1)) * 1000;
        let per = 0;

        super({
            children: [graphics],
            step(delta) {
                per = Math.min(1, per + perSpeed * delta);

                graphics.clear();

                graphics.beginFill(color);
                if (per > 0) graphics.drawCircle(start.x, start.y, width / 2);
                if (per == 1) graphics.drawCircle(end.x, end.y, width / 2);
                graphics.endFill();

                graphics.lineStyle(width, color);
                graphics.moveTo(start.x, start.y);
                const anPer = easing(per);
                graphics.lineTo(
                    start.x + (end.x - start.x) * anPer,
                    start.y + (end.y - start.y) * anPer
                );

                return per == 1;
            },
        });
    }
}
