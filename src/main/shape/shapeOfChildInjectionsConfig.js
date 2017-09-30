import { REGEX_INJECTION_NAME } from '../constant/constants'; 
import { Spec } from 'js-spec';

export default {
    childInjections:
        Spec.optional(
            Spec.or(
                {
                    when: Spec.array,

                    check:
                        Spec.and(
                            Spec.prop('length', Spec.greater(0)),
                            Spec.valuesOf(Spec.match(REGEX_INJECTION_NAME)),
                            Spec.unique
                        )
                },
                {
                    when: Spec.object,

                    check:
                        Spec.and(
                            Spec.keysOf(
                                Spec.match(REGEX_INJECTION_NAME)),
                            Spec.valuesOf(
                                Spec.shape({
                                    type:
                                        Spec.optional(Spec.function),
                                    nullable:
                                        Spec.optional(Spec.boolean),
                                    constraint:
                                        Spec.optional(Spec.function)
                                })))
                }))
};
