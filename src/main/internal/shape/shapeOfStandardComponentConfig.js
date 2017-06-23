import shapeOfPartialBaseConfig from './shapeOfPartialBaseConfig.js';

import { REGEX_METHOD_NAME, FORBIDDEN_METHOD_NAMES } from '../constant/constants.js'; 
import { Spec } from 'js-spec';

export default Object.assign({}, shapeOfPartialBaseConfig, {
    init: Spec.func,

    childInjection:
        Spec.optional(
            Spec.shape({
                keys: Spec.instanceOf(Array), // TODO

                get: Spec.func
            })),
        
    api:
        Spec.optional(
            Spec.and(
                Spec.keys(
                    Spec.and(
                        Spec.matches(REGEX_METHOD_NAME),
                        Spec.notIn(FORBIDDEN_METHOD_NAMES))),
                Spec.values(Spec.func)))
});
