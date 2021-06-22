import {IPoint} from "../animations/servicesGraph/_types/IPoint";

/**
 * Calculates the distance between two points
 * @param p1 THe first point
 * @param p2 The second point
 * @returns The distance
 */
export function getDist(p1: IPoint, p2: IPoint): number {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    return Math.sqrt(dx * dx + dy * dy);
}
