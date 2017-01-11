import Spec from '../../../api/Spec.js';

import prettifyComponentConfigError
	from '../helper/prettifyComponentConfigError.js';

import shapeOfFunctionalComponentConfig
	from '../shape/shapeOfFunctionalComponentConfig.js';


export default function validateFunctionalComponentConfig(config) {
	const error =
		Spec.hasShape(shapeOfFunctionalComponentConfig)(config, '');

	return error !== null
		? prettifyComponentConfigError(error, config)
		: null;
}