import Spec from '../../../api/Spec.js';

export default {
	subscribe: Spec.isFunction,
	dispatch: Spec.isFunction,
	getState: Spec.optional(Spec.isFunction),
};
