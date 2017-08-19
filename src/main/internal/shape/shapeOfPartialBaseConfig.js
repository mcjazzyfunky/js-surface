import { Spec } from 'js-spec';

import { REGEX_COMPONENT_DISPLAY_NAME, REGEX_PROPERTY_NAME }
    from '../constant/constants.js';

export default {
    displayName: 
        Spec.match(REGEX_COMPONENT_DISPLAY_NAME),

    properties:
        Spec.optional(
            Spec.or(
                {
                    when: it => Array.isArray(it),

                    validator:
                        Spec.and(
                            Spec.array,
                            Spec.size(Spec.greater(0)),
                            Spec.valuesOf(Spec.match(REGEX_PROPERTY_NAME)),
                            Spec.unique
                        )
                },
                {
                    when:
                        it => it && it instanceof Object,

                    validator:
                        Spec.and(
                            Spec.keysOf(
                                Spec.match(REGEX_PROPERTY_NAME)),
                            Spec.valuesOf(
                                Spec.shape({
                                    type:
                                        Spec.optional(Spec.function),
                                    nullable:
                                        Spec.optional(Spec.boolean),
                                    constraint:
                                        Spec.optional(Spec.validator),
                                    defaultValue:
                                        Spec.any,
                                    inject:
                                        Spec.optional(Spec.boolean)
                                })))
                }))
};
