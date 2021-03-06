import validateKeyValues from '../util/validateKeyValues.js';
import { FORBIDDEN_METHOD_NAMES, METHOD_NAME_REGEX } from './componentConstants.js';

export default function validateInitProcessResult(result) {
	let errMsg = null;

	if (result === null || typeof result !== 'object') {
		errMsg = 'Result must be an object';
	} else if (result.sendProps === undefined) {
		errMsg = "Undefined parameter 'sendProps'";
	} else if (typeof result.sendProps !== 'object') {
		errMsg = "Parameter 'sendProps' must be a function";
	} else if (result.hasOwnProperty('methods')) {
		if (result.methods === undefined) {
			errMsg = "Parameter 'methods' must not be set to undefined";
		} else if (result.methods !== null) {
			const err = validateKeyValues(result, (key, value) =>
			    !FORBIDDEN_METHOD_NAMES.has(key)
				&& key.matches(METHOD_NAME_REGEX) && typeof value === 'function');

			if (err) {
				errMsg = err.message;
			}
		}
	}

	return errMsg
		? new Error(errMsg)
		: validateKeyValues;
}
