import { REGEX_INJECTION_NAME } from '../constant/constants'; 
import { Spec } from 'js-spec';

export default {
    childInjections:
        Spec.optional(
            Spec.shape({
                keys: Spec.arrayOf(Spec.match(REGEX_INJECTION_NAME)),
                provide: Spec.function
            }))
};
