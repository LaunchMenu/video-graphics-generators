import {ease} from "../ease";
import {getDist} from "../getDist";
import {Sequence} from "../sequence/Sequence";
import {ICameraTransform} from "../_types/ICameraData";
import {IPathFollowData} from "./_types/IPathFollowData";

export class PathFollower extends Sequence {
    /**
     * Creates a new camera object follow
     * @param config The follower configuration
     */
    public constructor({
        camera,
        points,
        duration,
        speed,
        easing = ease.linear,
    }: IPathFollowData) {
        const totalLength = points.slice(1).reduce(
            ({length, prev}, point) => ({
                length: length + getDist(point, prev),
                prev: point,
            }),
            {length: 0, prev: points[0]}
        ).length;
        const perSpeed = speed ? speed / totalLength : (1 / (duration ?? 1)) * 1000;
        let totalPer = 0;

        super(res => {
            camera.setController({
                step: async delta => {
                    if (totalPer == 1) return true;
                    totalPer = Math.min(1, totalPer + perSpeed * delta);

                    let per = easing(totalPer);
                    let cameraTransform: ICameraTransform | null = null;
                    let prevPos: ICameraTransform = points[0];
                    for (let point of points.slice(1)) {
                        const length = getDist(point, prevPos);
                        const perAmount = length / totalLength;
                        if (perAmount >= per) {
                            cameraTransform = {
                                x: prevPos.x + ((point.x - prevPos.x) * per) / perAmount,
                                y: prevPos.y + ((point.y - prevPos.y) * per) / perAmount,
                                angle:
                                    (prevPos.angle ?? 0) +
                                    (((point.angle ?? 0) - (prevPos.angle ?? 0)) * per) /
                                        perAmount,
                                zoom:
                                    (prevPos.zoom ?? 1) +
                                    (((point.zoom ?? 1) - (prevPos.zoom ?? 1)) * per) /
                                        perAmount,
                            };
                            break;
                        }

                        per -= perAmount;
                        prevPos = point;
                    }

                    if (cameraTransform) camera.setPosition(cameraTransform);
                    if (totalPer == 1) {
                        res();
                        return true;
                    }
                    return false;
                },
            });
        });
    }
}
