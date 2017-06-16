import Spec from '../../../api/Spec.js';

export default  {
    createElement: Spec.isFunction,
    createFactory: Spec.isFunction,
    isBrowserBased: Spec.optional(Spec.isBoolean),
    isValidElement: Spec.isFunction,
    render: Spec.isFunction,
    Component: Spec.isFunction
};

