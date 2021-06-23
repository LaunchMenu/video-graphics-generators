import {Container} from "pixi.js";
import {Sequence} from "../sequence/Sequence";
import {IAnimatable} from "../_types/IAnimatable";
import {IAnimatableInit, IAnimatableInitCore} from "../_types/IAnimatableInit";
import {ISequenceable} from "../_types/ISequenceable";

export class Animatable<
        T extends IAnimatable & ISequenceable & Container = IAnimatable &
            ISequenceable &
            Container
    >
    extends Container
    implements IAnimatable, ISequenceable
{
    protected finish: () => void;
    protected started = false;
    protected hasFinished = false;
    protected sequenceable = new Sequence(finish => {
        this.started = true;
        this.finish = finish;
    });

    protected data: IAnimatableInitCore;
    protected id = Math.random();

    /**
     * Creates a new animatable container
     * @param init The initialization information
     */
    public constructor(init: IAnimatableInit<T>) {
        super();
        if (init instanceof Function) init = init(this as any);
        this.data = init;
        if (init.children.length > 0) this.addChild(...init.children);
    }

    /**
     * A promise that resolves once the sequenceable is fully executed
     */
    public finished = this.sequenceable.finished;

    /**
     * Updates the state for the next frame to be rendered
     * @param delta The time delta
     * @returns Whether the animation finished
     */
    public async step(delta: number): Promise<boolean> {
        this.data.continuousStep?.(delta);
        if (this.started && !this.hasFinished) {
            const finished = await this.data.step(delta);
            if (finished) {
                this.hasFinished = true;
                this.finish();
            }
        }
        return this.hasFinished;
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
