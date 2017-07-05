import { REGEX_INJECTION_NAME } from '../constant/constants.js'; 
import { Spec } from 'js-spec';

export default {
    childInjections:
        Spec.optional(
            Spec.or(
                Spec.and(
                    Spec.array,
                    Spec.length(Spec.greater(0)),
                    Spec.values(Spec.matches(REGEX_INJECTION_NAME)),
                    Spec.unique
                ),
                Spec.and(
                    Spec.keys(
                        Spec.matches(REGEX_INJECTION_NAME)),
                    Spec.values(
                        Spec.shape({
                            type:
                                Spec.optional(Spec.func),
                            nullable:
                                Spec.optional(Spec.boolean),
                            constraint:
                                Spec.optional(Spec.func)
                        }))))),
};
