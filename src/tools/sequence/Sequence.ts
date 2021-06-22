import {IProcessGetter} from "../_types/IProccessGetter";
import {ISequenceable} from "../_types/ISequenceable";

export class Sequence implements ISequenceable {
    protected process: IProcessGetter;
    protected started = false;
    protected resolve: () => void;

    /**
     * A promise that resolves once the sequenceable is fully executed
     */
    public finished = new Promise<void>(res => {
        this.resolve = res;
    });

    /**
     * Creates a new sequencable item
     * @param process The process to be sequenced
     */
    public constructor(process: IProcessGetter) {
        this.process = process;
    }

    /**
     * Indicates that this sequenceable should start executing
     * @returns Whether the sequenceable wasn't already started
     */
    public start(): boolean {
        if (this.started) return true;
        const promise = this.process(this.resolve);
        if (promise instanceof Promise) promise.then(this.resolve);

        return false;
    }

    /**
     * All items to be started after this item
     * @param next The next items in the sequence (in parallel)
     * @returns A sequencable that represents this sequence augmented by the next items
     */
    public next(...next: ISequenceable[]): ISequenceable {
        return new Sequence(async () => {
            this.start();
            await this.finished;
            await Promise.all(
                next.map(sequenceable => {
                    sequenceable.start();
                    return sequenceable.finished;
                })
            );
        });
    }

    /**
     * Chains the given sequenceables after one and another
     * @param chain The chain of sequencables to connect
     * @returns The combined sequence
     */
    public static chain(...chain: ISequenceable[]): ISequenceable {
        return new Sequence(() =>
            chain.reduce(
                (chain, item) =>
                    chain.then(() => {
                        item.start();
                        return item.finished;
                    }),
                Promise.resolve()
            )
        );
    }

    /**
     * Creates a new sequencable that contains all given parallel sequences
     * @param sequences The sequences to be performed in parallel
     * @returns The combined sequence
     */
    public static parallel(...sequences: ISequenceable[]): ISequenceable {
        return new Sequence(async () => {
            await Promise.all(
                sequences.map(sequenceable => {
                    sequenceable.start();
                    return sequenceable.finished;
                })
            );
        });
    }

    /**
     * Creates a new sequencable that finishes after the specified delay, independent of when the passed sequence finishes
     * @param sequence THe sequence to wrap
     * @param delay The delay after which the sequence should finish
     * @returns The created time sequence
     */
    public static timed(sequence: ISequenceable, delay: number): ISequenceable {
        return new Sequence(res => {
            sequence.start();
            setTimeout(res, delay);
        });
    }
}
