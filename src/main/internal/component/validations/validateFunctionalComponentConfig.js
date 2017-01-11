import Constraints from '../../../api/Constraints.js';

import prettifyComponentConfigError
	from '../helpers/prettifyComponentConfigError.js';

import shapeOfFunctionalComponentConfig
	from '../shapes/shapeOfFunctionalComponentConfig.js';


export default function validateFunctionalComponentConfig(config) {
	const error =
		Constraints.hasShape(shapeOfFunctionalComponentConfig)(config, '');

	return error !== null
		? prettifyComponentConfigError(error, config)
		: null;
}