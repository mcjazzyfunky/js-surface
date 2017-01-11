import Spec from '../../../api/Spec.js';

import prettifyComponentConfigError
	from '../helper/prettifyComponentConfigError.js';

import shapeOfAdvancedComponentConfig
	from '../shape/shapeOfAdvancedComponentConfig.js';


export default function validateFunctionalComponentConfig(config) {
	const error =
		Spec.hasShape(shapeOfAdvancedComponentConfig)(config, '');

	return error !== null
		? prettifyComponentConfigError(error, config)
		: null;
}