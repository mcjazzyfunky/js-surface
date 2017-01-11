import Spec from '../../../api/Spec.js';

import prettifyComponentConfigError
	from '../helper/prettifyComponentConfigError.js';

import shapeOfBasicComponentConfig
	from '../shape/shapeOfBasicComponentConfig.js';


export default function validateFunctionalComponentConfig(config) {
	const error =
		Spec.hasShape(shapeOfBasicComponentConfig)(config, '');

	return error !== null
		? prettifyComponentConfigError(error, config)
		: null;
}