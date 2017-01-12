import { REGEX_METHOD_NAME, FORBIDDEN_METHOD_NAMES } from '../constant/constants.js'; 
import Spec from '../../../api/Spec.js';

export default
	{ onProps:
		Spec.isFunction
		
	, methods:
	    Spec.optional(
			Spec.and(
				Spec.hasKeysOf(
					Spec.and(
						Spec.matches(REGEX_METHOD_NAME),
						Spec.isNotIn(FORBIDDEN_METHOD_NAMES))),
				Spec.hasValuesOf(Spec.isFunction)))
	};