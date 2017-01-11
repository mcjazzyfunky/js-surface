import Spec from '../../../api/Spec.js';

import prettifyComponentConfigError
	from '../helper/prettifyComponentConfigError.js';

import shapeOfStandardComponentConfig
	from '../shape/shapeOfStandardComponentConfig.js';


export default function validateFunctionalComponentConfig(config) {
	const error =
		Spec.hasShape(shapeOfStandardComponentConfig)(config, '');

	return error !== null
		? prettifyComponentConfigError(error, config)
		: null;
}
