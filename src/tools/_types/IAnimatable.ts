export type IAnimatable = {
    /**
     * Updates the state for the next frame to be rendered
     * @param delta The time delta
     * @returns Whether the animation finished
     */
    step(delta: number): Promise<boolean | void>;
};
