import {IAnimatable} from "../_types/IAnimatable";
import {Sequence} from "./Sequence";

/**
 * Creates a sequenceable that waits for the provided number of milliseconds
 * @param duration The duration to wait
 * @returns A sequenceable that waits for th provided number of milliseconds
 */
export function wait(duration: number): Sequence {
    return new Sequence(res => {
        resolvers.push({res, duration});
    });
}

let resolvers: {res: () => void; duration: number}[] = [];

/**
 * The animatable that times the wait calls
 */
export const waitUpdater: IAnimatable = {
    async step(delta) {
        resolvers.forEach(resolver => {
            resolver.duration -= delta * 1000;
            if (resolver.duration < 0) resolver.res();
        });
        resolvers = resolvers.filter(({duration}) => duration > 0);
        return resolvers.length == 0;
    },
};
