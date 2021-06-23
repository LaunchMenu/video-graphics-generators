import {ease} from "../ease";
import {Sequence} from "../sequence/Sequence";
import {ICameraMoveData} from "./_types/ICameraMoveData";

export class CameraMove extends Sequence {
    /**
     * Creates a new camera move
     * @param config The follower configuration
     */
    public constructor({camera, point, duration, easing = ease.linear}: ICameraMoveData) {
        const totalDuration = duration;
        super(res => {
            const start = camera.getPosition();

            camera.setController({
                step: async delta => {
                    if (duration < 0) return true;

                    duration -= delta * 1000;

                    const end = point();
                    const timePer = 1 - duration / totalDuration;
                    const per = easing(timePer);

                    const transform = {
                        x: start.x + (end.x - start.x) * per,
                        y: start.y + (end.y - start.y) * per,
                        zoom: end.zoom
                            ? start.zoom + (end.zoom - start.zoom) * per
                            : undefined,
                        angle: end.angle
                            ? start.angle + (end.angle - start.angle) * per
                            : undefined,
                    };

                    camera.setPosition(transform);

                    if (duration < 0) res();
                    return false;
                },
            });
        });
    }
}
