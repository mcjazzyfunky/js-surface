import { REGEX_COMPONENT_SYSTEM_NAME } from '../constant/constants.js';
import { Spec } from 'js-spec';


export default  {
    componentSystemName: Spec.matches(REGEX_COMPONENT_SYSTEM_NAME),
    createElement: Spec.func,
    createFactory: Spec.func,
    isBrowserBased: Spec.optional(Spec.boolean),
    isValidElement: Spec.func,
    render: Spec.func,
    Component: Spec.func
};

