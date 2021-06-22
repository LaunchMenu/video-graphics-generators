import {Container} from "pixi.js";
import {IPoint} from "../../animations/servicesGraph/_types/IPoint";
import {AnimationContainer} from "../animatables/AnimationContainer";
import {ease} from "../ease";
import {getDist} from "../getDist";
import {Sequence} from "../sequence/Sequence";
import {
    ICameraData,
    ICameraPath,
    ICameraPaths,
    ICameraPointPath,
    ICameraTransform,
} from "../_types/ICameraData";
import {ISequenceable} from "../_types/ISequenceable";

export class Camera<T extends ICameraPaths = ICameraPaths> extends AnimationContainer {
    /** The path of the camera */
    public paths: {[K in keyof T]: ISequenceable};

    protected target: Container;
    protected size: {width: number; height: number};

    protected timePer = 0;
    protected path?: ICameraPath;
    protected length = 0;
    protected finish: () => void = () => {};

    protected elapsedTime = 0;
    protected targetIndex = 0;

    /**
     * Creates a new camera
     * @param config The configuration for the camera
     */
    public constructor({target, paths, size}: ICameraData<T>) {
        super();
        this.target = target;
        this.size = size;
        this.paths = Object.fromEntries(
            Object.entries(paths).map(([name, path]) => [
                name,
                new Sequence(finish => {
                    this.timePer = 0;
                    this.elapsedTime = 0;
                    this.targetIndex = 0;
                    this.path = path;
                    this.finish = finish;
                    if ("points" in path) {
                        this.length = path.points.slice(1).reduce(
                            ({length, prev}, point) => ({
                                length: length + getDist(point, prev),
                                prev: point,
                            }),
                            {length: 0, prev: path.points[0]}
                        ).length;
                    }
                }),
            ])
        ) as any;

        this.target.x = this.size.width / 2;
        this.target.y = this.size.height / 2;

        this.target.pivot.x = this.size.width / 2;
        this.target.pivot.y = this.size.height / 2;
    }

    /**
     * Takes a single step
     * @param delta The delta of passed time
     */
    public async step(delta: number): Promise<boolean> {
        let finished = true;
        if (this.path) {
            if ("points" in this.path) {
                this.followPoints(this.path, delta);
                finished = this.timePer == 1;
            } else {
                this.elapsedTime += delta;
                const target = this.path.targets[this.targetIndex];
                if (!target) {
                    finished = true;
                    this.finish();
                } else {
                    this.setPosition({
                        ...target.target.point,
                        zoom: target.zoom,
                        angle: target.angle,
                    });
                    if (this.elapsedTime * 1000 >= target.duration) {
                        this.targetIndex++;
                        this.elapsedTime = 0;
                    }
                }
            }
        }

        return (await super.step(delta)) && finished;
    }

    /**
     * Sets the position of the camera
     * @param transform The transformation to set
     */
    protected setPosition(transform: ICameraTransform): void {
        this.target.pivot.x = transform.x;
        this.target.pivot.y = transform.y;

        if (transform.zoom) {
            this.target.scale.x = transform.zoom;
            this.target.scale.y = transform.zoom;
        }
        if (transform.angle) this.target.angle = -transform.angle;
    }

    /**
     * Follows the given points path
     * @param path The path to follow
     * @param delta The elapsed time
     */
    protected followPoints(path: ICameraPointPath, delta: number): void {
        const perSpeed = path.speed
            ? path.speed / this.length
            : (1 / (path.duration ?? 1)) * 1000;
        this.timePer = Math.min(1, this.timePer + perSpeed * delta);

        let per = (path.easing ?? ease.linear)(this.timePer);
        let cameraTransform: ICameraTransform | null = null;
        let prevPos: ICameraTransform = path.points[0];
        for (let point of path.points.slice(1)) {
            const length = getDist(point, prevPos);
            const perAmount = length / this.length;
            if (perAmount >= per) {
                cameraTransform = {
                    x: prevPos.x + ((point.x - prevPos.x) * per) / perAmount,
                    y: prevPos.y + ((point.y - prevPos.y) * per) / perAmount,
                    angle:
                        (prevPos.angle ?? 0) +
                        (((point.angle ?? 0) - (prevPos.angle ?? 0)) * per) / perAmount,
                    zoom:
                        (prevPos.zoom ?? 0) +
                        (((point.zoom ?? 0) - (prevPos.zoom ?? 0)) * per) / perAmount,
                };
                break;
            }

            per -= perAmount;
            prevPos = point;
        }

        if (cameraTransform) this.setPosition(cameraTransform);
        if (this.timePer == 1) {
            this.path = undefined;
            this.finish();
        }
    }
}
