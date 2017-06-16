import { Spec } from 'js-spec';

import { REGEX_COMPONENT_NAME, REGEX_PROPERTY_NAME }
    from '../constant/constants.js';

export default
    { displayName: 
        Spec.matches(REGEX_COMPONENT_NAME)

    , properties:
        Spec.optional(
            Spec.and(
                Spec.hasKeysOf(
                    Spec.matches(REGEX_PROPERTY_NAME)),

                Spec.hasValuesOf(
                    Spec.hasShapeOf(
                        { type:
                            Spec.isFunction
                            
                        , assert:
                            Spec.optional(Spec.isFunction)

                        , preset:
                             Spec.any

                        , inject: Spec.satisfies(
                            it => it === undefined || it === true || it === false,
                            'Must be undefined or boolean')
                        })))
        )
    };
