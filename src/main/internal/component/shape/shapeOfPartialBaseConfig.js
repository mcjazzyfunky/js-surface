import Spec from '../../../api/Spec.js';

import { REGEX_COMPONENT_NAME, REGEX_PROPERTY_NAME }
    from '../constant/constants.js';

export default
    { name:
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

                        , defaultValue:
                             Spec.any

                        , inject: Spec.satisfies(
                            it => it === undefined || it === true || it === false,
                            'Must be undefined or boolean')
                        })))
        )
    };
