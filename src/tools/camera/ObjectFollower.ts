import {Sequence} from "../sequence/Sequence";
import {IObjectFollowData} from "./_types/IObjectFollowData";

export class ObjectFollower extends Sequence {
    /**
     * Creates a new camera object follow
     * @param config The follower configuration
     */
    public constructor({
        camera,
        target,
        duration,
        zoom,
        angle,
        offset,
    }: IObjectFollowData) {
        super(res => {
            camera.setController({
                step: async delta => {
                    if (duration < 0) return true;

                    duration -= delta * 1000;

                    const point = {...target.point, zoom, angle};
                    if (offset) {
                        point.x += offset.x;
                        point.y += offset.y;
                    }

                    camera.setPosition(point);

                    if (duration < 0) res();
                    return false;
                },
            });
        });
    }
}
