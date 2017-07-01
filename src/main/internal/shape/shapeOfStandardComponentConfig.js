import shapeOfPartialBaseConfig from './shapeOfPartialBaseConfig.js';
import shapeOfChildInjectionKeysConfig from './shapeOfChildInjectionKeysConfig.js';

import { REGEX_METHOD_NAME, FORBIDDEN_METHOD_NAMES } from '../constant/constants.js'; 
import { Spec } from 'js-spec';

export default Object.assign({},
    shapeOfPartialBaseConfig,
    shapeOfChildInjectionKeysConfig,
    {   
        init: Spec.func,

        publicMethods:
            Spec.optional(
                Spec.and(
                    Spec.object,
                    Spec.keys(
                        Spec.and(
                            Spec.matches(REGEX_METHOD_NAME),
                            Spec.notIn(FORBIDDEN_METHOD_NAMES))),
                    Spec.values(Spec.func)))
    });
