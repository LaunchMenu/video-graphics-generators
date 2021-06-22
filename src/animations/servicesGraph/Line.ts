import {Graphics} from "pixi.js";
import {Animatable} from "../../tools/animatables/Animatable";
import {ease} from "../../tools/ease";
import {getDist} from "../../tools/getDist";
import {ILineData} from "./_types/ILineData";
import {IPoint} from "./_types/IPoint";

export class Line extends Animatable {
    /** The current endpoint of the line */
    public point: IPoint;

    /** All the points of the line */
    public readonly points: IPoint[];

    /**
     * Creates a new line segment
     * @param init The initialization data
     */
    public constructor({
        points,
        duration,
        speed,
        color,
        width,
        easing = ease.linear,
    }: ILineData) {
        const graphics = new Graphics();

        // Obtain the total length
        let length = 0;
        let prevPoint = points[0];
        for (let point of points.slice(1)) {
            length += getDist(point, prevPoint);
            prevPoint = point;
        }
        const perSpeed = speed ? speed / length : (1 / (duration ?? 1)) * 1000;

        let totalPer = 0;
        super({
            children: [graphics],
            step: delta => {
                totalPer = Math.min(1, totalPer + perSpeed * delta);
                let per = easing(totalPer);

                graphics.clear();

                // Create all the segments
                prevPoint = points[0];
                for (let point of points.slice(1)) {
                    if (per == 0) break;
                    const segLength = getDist(prevPoint, point);
                    const segLengthPer = segLength / length;
                    // console.log(segLengthPer, segLength, length);

                    const segPer = Math.min(1, per / segLengthPer);
                    const endPoint = {
                        x: prevPoint.x + (point.x - prevPoint.x) * segPer,
                        y: prevPoint.y + (point.y - prevPoint.y) * segPer,
                    };

                    graphics.beginFill(color);
                    graphics.drawCircle(prevPoint.x, prevPoint.y, width / 2);
                    graphics.drawCircle(endPoint.x, endPoint.y, width / 2);
                    graphics.endFill();

                    graphics.lineStyle(width, color);
                    graphics.moveTo(prevPoint.x, prevPoint.y);
                    graphics.lineTo(endPoint.x, endPoint.y);
                    graphics.lineStyle(0, color);

                    this.point = endPoint;
                    if (per < segLengthPer) {
                        break;
                    }

                    prevPoint = point;
                    per -= segLengthPer;
                }

                return totalPer == 1;
            },
        });

        this.point = points[0];
        this.points = points;
    }
}
