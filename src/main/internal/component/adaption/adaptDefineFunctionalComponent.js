import createPropsAdjuster from '../helper/createPropsAdjuster.js';

import validateFunctionalComponentConfig
    from '../validation/validateFunctionalComponentConfig.js';

export default function adaptDefineFunctionalComponent(config, platformAdaption) {
    const err = validateFunctionalComponentConfig(config);

    if (err) {
        throw err;
    }

    const
        propsAdjuster = createPropsAdjuster(config),

        adjustedConfig = {
            displayName:  config.displayName,
            properties: config.properties,
            render: props => config.render(propsAdjuster(props))
        };

    return platformAdaption(adjustedConfig);
}
