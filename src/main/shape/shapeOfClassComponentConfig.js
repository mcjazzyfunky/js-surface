import shapeOfPartialBaseConfig from './shapeOfPartialBaseConfig';
import shapeOfChildInjectionsConfig from './shapeOfChildInjectionsConfig';

import { REGEX_METHOD_NAME, FORBIDDEN_METHOD_NAMES }
    from '../constant/constants'; 

import { Spec } from 'js-spec';

export default Object.assign(
    {
        publicMethods:
            Spec.optional(
                Spec.and(
                    Spec.object,
                    Spec.keysOf(
                        Spec.and(
                            Spec.match(REGEX_METHOD_NAME),
                            Spec.notIn(FORBIDDEN_METHOD_NAMES))),
                    Spec.valuesOf(Spec.function)))
    },
    shapeOfPartialBaseConfig,
    shapeOfChildInjectionsConfig);
