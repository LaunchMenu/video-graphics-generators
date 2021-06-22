export type ISequenceable = {
    /**
     * Indicates that this sequenceable should start executing
     * @returns Whether the sequenceable wasn't already started
     */
    start(): boolean;

    /**
     * A promise that resolves once the sequenceable is fully executed
     */
    finished: Promise<void>;

    /**
     * All items to be started after this item
     * @param next The next items in the sequence (in parallel)
     * @returns A sequencable that represents this sequence augmented by the next items
     */
    next(...next: ISequenceable[]): ISequenceable;
};
