import {Container, DisplayObject} from "pixi.js";
import {Sequence} from "../sequence/Sequence";
import {IAnimatable} from "../_types/IAnimatable";
import {ISequenceable} from "../_types/ISequenceable";

/**
 * A graphics container that also updates animation steps
 */
export class AnimationContainer extends Container implements IAnimatable, IAnimatable {
    children: (DisplayObject & IAnimatable)[];
    protected sequenceable: ISequenceable;
    /**
     * A promise that resolves once the sequenceable is fully executed
     */
    public finished: Promise<void>;

    /**
     * Creates a new animation container
     * @param children The children of the container
     * @param sequenceable The sequenceable object
     */
    public constructor(children?: DisplayObject[], sequenceable?: ISequenceable);

    /**
     * Creates a new animation container
     * @param children The children of the container
     * @param sequenceable The sequenceable object
     */
    public constructor(children: (DisplayObject & ISequenceable)[]);

    public constructor(
        children?: (DisplayObject & ISequenceable)[],
        sequenceable?: ISequenceable
    ) {
        super();

        if (!children) children = [];
        if (children.length) this.addChild(...children);
        if (!sequenceable)
            sequenceable = Sequence.parallel(
                ...children.filter(
                    (child): child is DisplayObject & ISequenceable => !!child.next
                )
            );
        this.sequenceable = sequenceable;
    }

    /**
     * Updates the state for the next frame to be rendered
     * @param delta The time delta
     * @returns Whether the animation finished
     */
    public async step(delta: number): Promise<boolean> {
        const stepResults = await Promise.all(
            this.children
                .filter((item): item is DisplayObject & IAnimatable => !!item.step)
                .map(item => item.step(delta))
        );
        return stepResults.every(done => done);
    }

    /**
     * Indicates that this sequenceable should start executing
     * @returns Whether the sequenceable wasn't already started
     */
    public start(): boolean {
        return this.sequenceable.start();
    }

    /**
     * All items to be started after this item
     * @param next The next items in the sequence (in parallel)
     * @returns A sequencable that represents this sequence augmented by the next items
     */
    public next(...next: ISequenceable[]): ISequenceable {
        return this.sequenceable.next(...next);
    }
}
