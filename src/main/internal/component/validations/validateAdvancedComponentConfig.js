import Constraints from '../../../api/Constraints.js';

import prettifyComponentConfigError
	from '../helpers/prettifyComponentConfigError.js';

import shapeOfAdvancedComponentConfig
	from '../shapes/shapeOfAdvancedComponentConfig.js';


export default function validateFunctionalComponentConfig(config) {
	const error =
		Constraints.hasShape(shapeOfAdvancedComponentConfig)(config, '');

	return error !== null
		? prettifyComponentConfigError(error, config)
		: null;
}