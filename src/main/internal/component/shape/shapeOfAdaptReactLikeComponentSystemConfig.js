import { Spec } from 'js-spec';

export default  {
    createElement: Spec.isFunction,
    createFactory: Spec.isFunction,
    isBrowserBased: Spec.optional(Spec.isBoolean),
    isValidElement: Spec.isFunction,
    render: Spec.isFunction,
    Component: Spec.isFunction
};

