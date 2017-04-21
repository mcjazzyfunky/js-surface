import Spec from '../../../api/Spec.js';

export default {
    adapterName: Spec.isString,
    createElement: Spec.isFunction,
    isElement: Spec.isFunction,
    defineFunctionalComponent: Spec.isFunction,
    defineClassComponent: Spec.isFunction,
    render: Spec.isFunction
};
