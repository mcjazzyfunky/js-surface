import shapeOfPartialBaseConfig from './shapeOfPartialBaseConfig.js';
import shapeOfchildInjectionsConfig from './shapeOfchildInjectionsConfig.js';

import { REGEX_METHOD_NAME, FORBIDDEN_METHOD_NAMES } from '../constant/constants.js'; 
import { Spec } from 'js-spec';

export default Object.assign({},
    shapeOfPartialBaseConfig,
    shapeOfchildInjectionsConfig,
    {   
        init: Spec.function,

        publicMethods:
            Spec.optional(
                Spec.and(
                    Spec.object,
                    Spec.keysOf(
                        Spec.and(
                            Spec.match(REGEX_METHOD_NAME),
                            Spec.notIn(FORBIDDEN_METHOD_NAMES))),
                    Spec.valuesOf(Spec.function)))
    });
