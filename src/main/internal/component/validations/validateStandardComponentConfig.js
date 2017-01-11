import Constraints from '../../../api/Constraints.js';

import prettifyComponentConfigError
	from '../helpers/prettifyComponentConfigError.js';

import shapeOfStandardComponentConfig
	from '../shapes/shapeOfStandardComponentConfig.js';


export default function validateFunctionalComponentConfig(config) {
	const error =
		Constraints.hasShape(shapeOfStandardComponentConfig)(config, '');

	return error !== null
		? prettifyComponentConfigError(error, config)
		: null;
}
