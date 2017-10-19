import shapeOfPartialBaseConfig from './shapeOfPartialBaseConfig';

import { REGEX_METHOD_NAME, FORBIDDEN_METHOD_NAMES, REGEX_INJECTION_NAME }
    from '../constant/constants'; 

import { Spec } from 'js-spec';

export default Object.assign(
    {
        publicMethods:
            Spec.optional(
                Spec.arrayOf(
                    Spec.and(
                        Spec.match(REGEX_METHOD_NAME),
                         Spec.notIn(FORBIDDEN_METHOD_NAMES)))),
        
        provides:
            Spec.optional(
                Spec.arrayOf(
                    Spec.match(REGEX_INJECTION_NAME)))
    },
    shapeOfPartialBaseConfig);
