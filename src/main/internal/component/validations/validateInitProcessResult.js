import Constraints from '../../../api/Constraints.js';

import shapeOfInitProcessResult
	from '../shapes/shapeOfInitProcessResult.js';


export default function validateInitProcessResult(initProcessResult, config) {
	let error =
		Constraints.hasShape(shapeOfInitProcessResult)(initProcessResult, '');

	if (error) {
		error = Error(
		    `Function 'initProcess' of general component '${config.name}' `
		    + `has returned an invalid value => ${error.message}`);
	}

	return error;
}