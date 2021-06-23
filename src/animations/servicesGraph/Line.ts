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
        data,
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
        const perDataSpeed = data ? data.speed / length : 0;
        const perDataShowSpeed = data ? (1 / (data.showTransDuration ?? 1)) * 1000 : 0;

        let totalPer = 0;
        let state = "trans";
        let dataPathPer = 0;
        let dataShowPer = 0;
        super({
            children: [graphics],
            step: delta => {
                totalPer = Math.min(1, totalPer + perSpeed * delta);

                return totalPer == 1;
            },
            continuousStep: delta => {
                // Draw data
                if (perDataSpeed) {
                    graphics.clear();

                    const end = easing(totalPer);
                    if (state == "trans") {
                        if (dataShowPer < 1) {
                            dataShowPer = Math.min(
                                1,
                                dataShowPer + perDataShowSpeed * delta
                            );
                            if (dataShowPer == 1) state = "move";
                        } else {
                            dataShowPer = Math.min(
                                2,
                                dataShowPer + perDataShowSpeed * delta
                            );
                            dataPathPer = end;
                            if (dataShowPer == 2) {
                                dataPathPer = 0;
                                dataShowPer = 0;
                            }
                        }
                    } else {
                        dataPathPer = Math.min(end, dataPathPer + perDataSpeed * delta);
                        if (dataPathPer == end) state = "trans";
                    }

                    prevPoint = points[0];
                    let per = dataPathPer;
                    for (let point of points.slice(1)) {
                        if (per == 0) break;
                        const segLength = getDist(prevPoint, point);
                        const segLengthPer = segLength / length;

                        const segPer = per / segLengthPer;
                        const endPoint = {
                            x: prevPoint.x + (point.x - prevPoint.x) * segPer,
                            y: prevPoint.y + (point.y - prevPoint.y) * segPer,
                        };

                        if (segPer <= 1) {
                            graphics.beginFill(color, 1 - Math.abs(dataShowPer - 1)); // Both 0 and 2 map to 0, and 1 maps to 1
                            graphics.drawCircle(endPoint.x, endPoint.y, width);
                            graphics.endFill();
                            break;
                        }

                        prevPoint = point;
                        per -= segLengthPer;
                    }
                }

                // Draw line
                let per = easing(totalPer);
                prevPoint = points[0];
                for (let point of points.slice(1)) {
                    if (per == 0) break;
                    const segLength = getDist(prevPoint, point);
                    const segLengthPer = segLength / length;

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
                    if (segPer < 1) break;

                    prevPoint = point;
                    per -= segLengthPer;
                }
            },
        });

        this.point = points[0];
        this.points = points;
    }
}
