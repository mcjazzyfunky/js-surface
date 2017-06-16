import { Spec } from 'js-spec';

export default {
    subscribe: Spec.isFunction,
    dispatch: Spec.isFunction,
    getState: Spec.optional(Spec.isFunction),
};
