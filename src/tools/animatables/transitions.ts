import {ITransitionType} from "../_types/ITransitionType";
import {AnimationContainer} from "./AnimationContainer";

export const transitions = {
    /** Scales the component into view */
    scale: (container => per => {
        container.scale.x = per;
        container.scale.y = per;
    }) as ITransitionType,
    /** Scales the component into view, scaling from the center */
    scaleCenter: (container => {
        const innerContainer = new AnimationContainer();
        innerContainer.addChild(...container.children);
        container.removeChildren();
        container.addChild(innerContainer);

        const bounds = innerContainer.getBounds();
        innerContainer.pivot.x = (bounds.left + bounds.right) / 2;
        innerContainer.pivot.y = (bounds.top + bounds.bottom) / 2;
        innerContainer.x = innerContainer.pivot.x;
        innerContainer.y = innerContainer.pivot.y;

        return per => {
            innerContainer.scale.x = per;
            innerContainer.scale.y = per;
        };
    }) as ITransitionType,
    /** Fades the component into view */
    fade: (container => per => {
        container.alpha = per;
    }) as ITransitionType,
};
