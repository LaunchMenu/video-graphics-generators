import {Sequence} from "./Sequence";

/**
 * Creates a sequenceable that waits for the provided number of milliseconds
 * @param duration The duration to wait
 * @returns A sequenceable that waits for th provided number of milliseconds
 */
export function wait(duration: number): Sequence {
    return new Sequence(res => setTimeout(res, duration));
}
