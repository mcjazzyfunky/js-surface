import Spec from '../../../api/Spec.js';

export default  {
    createElement: Spec.isFunction,
    defineFunctionalComponent: Spec.isFunction,
    defineStandardComponent: Spec.isFunction,
    isBrowserBased: Spec.optional(Spec.isBoolean),
    isElement: Spec.isFunction,
    render: Spec.isFunction
};
