import { REGEX_COMPONENT_SYSTEM_NAME } from '../constant/constants.js';
import { Spec } from 'js-spec';

export default  {
    componentSystemName: Spec.matches(REGEX_COMPONENT_SYSTEM_NAME),
    componentSystemAPI: Spec.object,
    createElement: Spec.func,
    defineFunctionalComponent: Spec.func,
    defineStandardComponent: Spec.func,
    isBrowserBased: Spec.optional(Spec.boolean),
    isElement: Spec.func,
    render: Spec.func
};
