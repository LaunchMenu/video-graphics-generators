import {Container} from "pixi.js";

export type ITransitionType = {
    /**
     * Creates a new transition function
     * @param container The container to be transitions
     * @returns The function that can be used to transition it
     */
    (container: Container): {
        /**
         * Updates the container to be in accordance to the given shown fraction
         * @param per How much is shown (between 0 and 1)
         */
        (per: number): void;
    };
};
