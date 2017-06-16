import { Spec } from 'js-spec';

export default  {
    createElement: Spec.isFunction,
    defineFunctionalComponent: Spec.isFunction,
    defineStandardComponent: Spec.isFunction,
    isBrowserBased: Spec.optional(Spec.isBoolean),
    isElement: Spec.isFunction,
    render: Spec.isFunction
};
