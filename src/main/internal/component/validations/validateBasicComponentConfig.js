import Constraints from '../../../api/Constraints.js';

import prettifyComponentConfigError
	from '../helpers/prettifyComponentConfigError.js';

import shapeOfBasicComponentConfig
	from '../shapes/shapeOfBasicComponentConfig.js';


export default function validateFunctionalComponentConfig(config) {
	const error =
		Constraints.hasShape(shapeOfBasicComponentConfig)(config, '');

	return error !== null
		? prettifyComponentConfigError(error, config)
		: null;
}