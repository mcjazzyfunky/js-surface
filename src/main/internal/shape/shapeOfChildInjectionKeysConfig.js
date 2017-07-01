import { REGEX_INJECTION_NAME } from '../constant/constants.js'; 
import { Spec } from 'js-spec';

export default {
    childInjectionKeys:
        Spec.optional(
            Spec.and(
                Spec.array,
                Spec.length(Spec.greater(0)),
                Spec.values(Spec.matches(REGEX_INJECTION_NAME)))),
};