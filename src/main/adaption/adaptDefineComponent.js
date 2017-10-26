import validateComponentConfig from '../validation/validateComponentConfig';
import ConfigValues from '../system/ConfigValues';
import warn from '../helper/warn';
import buildComponentFactoryAttributes from '../helper/buildComponentFactoryAttributes';
import normalizeComponentConfig from '../helper/normalizeComponentConfig';
import createPropsAdjuster from '../helper/createPropsAdjuster';
import validateInitResult from '../validation/validateInitResult';

export default function adaptDefineComponentFunction(defineComponent) {
    const
        defineFunctionalComponent =
            adaptDefineFunctionalComponent(defineComponent),

        defineStandardComponent =
            adaptDefineStandardComponent(defineComponent);

    return function (config) {
        const
            isObject = config && typeof config === 'object',
            isFunctional = isObject && typeof config.render === 'function',
            isStandard = isObject && typeof config.init === 'function',
            hasRender = isObject && config.render !== undefined,
            hasInit = isObject && config.init !== undefined;

        if (ConfigValues.validateDefs === true) {
            const error = validateComponentConfig(config);

            if (error) {
                warn(error.message);

                warn('Negatively validated component configuration:',
                    config);

                throw new Error(`[defineComponent] ${error.message}`);
            }


            if (!hasRender && !hasInit) {
                throw new Error(
                    "[defineComponent] Config must either provide a function 'init' or a function 'render'");
            } else if (hasRender && hasInit) {
                throw new Error(
                    "[defineComponent] Config must not provide both functions 'init' and 'render'");      
            } else if (hasRender && !isFunctional) {
                throw new Error(
                    "[defineComponent] Config parameter 'render' has to be a function");
            } else if (hasInit && !isStandard) {
                throw new Error(
                    "[defineComponent] Config parameter 'init' has to be a function");
            }
        }

        return isFunctional
            ? defineFunctionalComponent(config)
            : defineStandardComponent(config);
    };
}

function adaptDefineFunctionalComponent(defineComponent) {
    const ret = cfg => {
        // cfg has already been validated

        const
            config = normalizeComponentConfig(cfg),
            propsAdjuster = createPropsAdjuster(config),

            adjustedConfig = {
                displayName:  config.displayName,
                properties: config.properties,
                render: props => config.render(propsAdjuster(props, ConfigValues.validateProps))
            };

        const factory = defineComponent(adjustedConfig);

        const factoryAttributes =
            buildComponentFactoryAttributes(factory, config, ret);

        Object.assign(factory, factoryAttributes);

        return factory;
    };

    return ret;
}

function adaptDefineStandardComponent(defineComponent) {
    const ret = cfg => {
        // cfg has already been validated

        const
            config = normalizeComponentConfig(cfg),
            propsAdjuster = createPropsAdjuster(config),
    
            adjustedConfig = Object.assign({}, config, {
                init: (updateView, forwardState) => {
                    const
                        result = config.init(updateView, forwardState),
                        err = validateInitResult(result, config);

                    if (err) {
                        throw err;
                    }

                    return Object.assign({}, result, {
                        setProps(props) {
                            const props2 = props === undefined
                                ? undefined
                                : propsAdjuster(props, ConfigValues.validateProps);


                            result.setProps(props2);
                        }
                    });
                }
            });

        const factory = defineComponent(adjustedConfig);
        
        const factoryAttributes =
            buildComponentFactoryAttributes(factory, config, ret);
        
        Object.assign(factory, factoryAttributes);

        return factory;
    };
    
    return ret;
}
