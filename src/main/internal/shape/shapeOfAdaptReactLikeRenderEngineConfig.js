import { REGEX_COMPONENT_SYSTEM_NAME } from '../constant/constants.js';
import { Spec } from 'js-spec';

export default  {
    renderEngineName: Spec.match(REGEX_COMPONENT_SYSTEM_NAME),
    renderEngineAPI: Spec.object,
    createElement: Spec.function,
    createFactory: Spec.function,
    isBrowserBased: Spec.optional(Spec.boolean),
    isValidElement: Spec.function,
    render: Spec.function,
    Component: Spec.function
};

