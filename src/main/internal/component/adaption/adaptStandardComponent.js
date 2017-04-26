import createPropsAdjuster from '../helper/createPropsAdjuster.js';
import validateConfigForStandardComponent from '../validation/validateStandardComponentConfig.js';
import validateInitResult from '../validation/validateInitResult.js';

export default function adaptStandardComponentDefinition(config, platformAdaption) {
    const err = validateConfigForStandardComponent(config);

    if (err) {
        throw err;
    }

    const propsAdjuster = createPropsAdjuster(config);
    
    const adjustedConfig = {
        displayName:  config.displayName,
        properties: config.properties,

        init: (onRender, onState = null) => {
            const
                result = config.init(onRender, onState),
                err = validateInitResult(result, config);

            if (err) {
                throw err;
            }

            return {
                onProps(props) {
                    result.onProps(propsAdjuster(props));
                },
                methods: result.methods || null
            };
        }
    };

    return platformAdaption(adjustedConfig);
}
