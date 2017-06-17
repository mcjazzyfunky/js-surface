import { Spec } from 'js-spec';

export default  {
    createElement: Spec.func,
    defineFunctionalComponent: Spec.func,
    defineStandardComponent: Spec.func,
    isBrowserBased: Spec.optional(Spec.boolean),
    isElement: Spec.func,
    render: Spec.func
};
