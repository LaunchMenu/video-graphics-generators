import {Animatable} from "./Animatable";
import {ease} from "../ease";
import {ITransitionData} from "../_types/ITransitionData";
import {transitions} from "./transitions";

export class TransitionIn extends Animatable {
    /**
     * Creates a new container that can animate into view
     * @param config The transition configuration
     */
    public constructor({
        item,
        duration,
        easing = ease.linear,
        type = transitions.fade,
    }: ITransitionData) {
        let per = 0;
        super(self => {
            self.addChild(item);
            const transition = type(self);
            transition(0);

            return {
                children: [],
                step: delta => {
                    per = Math.min(1, per + (delta / duration) * 1000);
                    transition(easing(per));
                    return per == 1;
                },
                continuousStep: delta => {
                    item.step?.(delta);
                },
            };
        });
    }
}
