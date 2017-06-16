import { Spec } from 'js-spec';

export default {
    subscribe: Spec.func,
    dispatch: Spec.func,
    getState: Spec.optional(Spec.func),
};
