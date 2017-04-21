import createPropsAdjuster from '../helper/createPropsAdjuster.js';
import validateConfigForBasicComponent from '../validation/validateStandardComponentConfig.js';
import validateInitProcessResult from '../validation/validateInitProcessResult.js';

export default function adaptBasicComponentDefinition(config, platformAdaption) {
    const err = validateConfigForBasicComponent(config);

    if (err) {
        throw err;
    }

    const propsAdjuster = createPropsAdjuster(config);
    
    const adjustedConfig = {
        displayName:  config.displayName,
        properties: config.properties,

        initProcess: (onRender, onState = null) => {
            const
                result = config.initProcess(onRender, onState),
                err = validateInitProcessResult(result, config);

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
