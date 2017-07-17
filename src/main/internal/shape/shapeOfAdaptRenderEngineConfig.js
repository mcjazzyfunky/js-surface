import { REGEX_COMPONENT_SYSTEM_NAME } from '../constant/constants.js';
import { Spec } from 'js-spec';

export default  {
    renderEngine: Spec.shape({
        name: Spec.match(REGEX_COMPONENT_SYSTEM_NAME),
        api: Spec.object,
    }),
    interface: Spec.shape({
        createElement: Spec.function,
        defineFunctionalComponent: Spec.function,
        defineStandardComponent: Spec.function,
        isElement: Spec.function
    }),
    options: Spec.optional(Spec.shape({
        isBrowserBased: Spec.optional(Spec.boolean)
    }))
};
