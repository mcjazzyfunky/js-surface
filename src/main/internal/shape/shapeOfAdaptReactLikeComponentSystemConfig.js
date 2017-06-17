import { Spec } from 'js-spec';

export default  {
    createElement: Spec.func,
    createFactory: Spec.func,
    isBrowserBased: Spec.optional(Spec.boolean),
    isValidElement: Spec.func,
    render: Spec.func,
    Component: Spec.func
};

