import createPropsAdjuster from '../helpers/createPropsAdjuster.js';

import validateFunctionalComponentConfig
	from '../validations/validateFunctionalComponentConfig.js';

export default function adaptFunctionalComponent(config, platformAdaption) {
	const err = validateFunctionalComponentConfig(config);

	if (err) {
		throw err;
	}

	const
	    propsAdjuster = createPropsAdjuster(config),

        adjustedConfig = {
		    name: config.name,
	        properties: config.properties,
		    render: props => config.render(propsAdjuster(props))
	    };

	return platformAdaption(adjustedConfig);
}
