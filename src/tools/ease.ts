/**
 * A set of easing functions
 *
 * Source: https://gist.github.com/gre/1650294
 */
export const ease = {
    /** no easing, no acceleration */
    linear: (t: number) => t,
    /** accelerating from zero velocity */
    inQuad: (t: number) => t * t,
    /** decelerating to zero velocity */
    outQuad: (t: number) => t * (2 - t),
    /** acceleration until halfway, then deceleration */
    inOutQuad: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
    /** accelerating from zero velocity */
    inCubic: (t: number) => t * t * t,
    /** decelerating to zero velocity */
    outCubic: (t: number) => --t * t * t + 1,
    /** acceleration until halfway, then deceleration */
    inOutCubic: (t: number) =>
        t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
    /** accelerating from zero velocity */
    inQuart: (t: number) => t * t * t * t,
    /** decelerating to zero velocity */
    outQuart: (t: number) => 1 - --t * t * t * t,
    /** acceleration until halfway, then deceleration */
    inOutQuart: (t: number) => (t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t),
    /** accelerating from zero velocity */
    inQuint: (t: number) => t * t * t * t * t,
    /** decelerating to zero velocity */
    outQuint: (t: number) => 1 + --t * t * t * t * t,
    /** acceleration until halfway, then deceleration */
    inOutQuint: (t: number) =>
        t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t,
    /** elastic bounce effect at the beginning */
    inElastic: (t: number) => (0.04 - 0.04 / t) * Math.sin(25 * t) + 1,
    /** elastic bounce effect at the end */
    outElastic: (t: number) => ((0.04 * t) / --t) * Math.sin(25 * t),
    /** elastic bounce effect at the beginning and end */
    inOutElastic: (t: number) =>
        (t -= 0.5) < 0
            ? (0.02 + 0.01 / t) * Math.sin(50 * t)
            : (0.02 - 0.01 / t) * Math.sin(50 * t) + 1,
};
