import Constraints from '../../../api/Constraints.js';

export default {
	subscribe: Constraints.isFunction,
	dispatch: Constraints.isFunction,
	getState: Constraints.optional(Constraints.isFunction),
};
