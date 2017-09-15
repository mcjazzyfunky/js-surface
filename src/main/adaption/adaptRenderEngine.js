import adaptCreateElement from './adaptCreateElement.js';
import adaptIsRenderable from './adaptIsRenderable.js';
import convertClassComponentConfig from '../conversion/convertClassComponentConfig.js';
import normalizeComponentConfig from '../helper/normalizeComponentConfig.js';
import createPropsAdjuster from '../helper/createPropsAdjuster.js';

import validateConfigForStandardComponent from '../validation/validateStandardComponentConfig.js';
import validateInitResult from '../validation/validateInitResult.js';

import { Spec } from 'js-spec';

import shapeOfAdaptRenderEngineConfig
    from './../shape/shapeOfAdaptRenderEngineConfig.js';

export default function adaptRenderEngine(config) {
    const err =
        Spec.shape(shapeOfAdaptRenderEngineConfig)
            .validate(config, '');

    if (err) {
        throw new Error(
            "Illegal first argument 'config' for "
            + "function 'adaptRenderEngine':"
            + err);
    }
    
    const
        createElement = config.options && config.options.isBrowserBased === false
            ? config.interface.createElement
            : adaptCreateElement(config.interface.createElement, config.interface.isElement),

        defineFunctionalComponent = enhanceDefineFunctionalComponent(config.interface.defineFunctionalComponent),
        defineStandardComponent = enhanceDefineStandardComponent(config.interface.defineStandardComponent),
        
        defineClassComponent = config => defineStandardComponent(
            convertClassComponentConfig(config)); 

    const RenderEngine = {
        name: config.renderEngine.name,
        api: config.renderEngine.api
    };

    Object.freeze(RenderEngine);

    return {
        RenderEngine: RenderEngine,
        createElement,
        defineFunctionalComponent,
        defineStandardComponent,
        defineClassComponent,
        isElement: config.interface.isElement,
        isRenderable: adaptIsRenderable(config.interface.isElement),
        render: config.interface.render
    };
}

function enhanceDefineFunctionalComponent(defineFunctionalComponent) {
    const ret = cfg => {
        const
            config = normalizeComponentConfig(cfg),
            propsAdjuster = createPropsAdjuster(config),

            adjustedConfig = {
                displayName:  config.displayName,
                properties: config.properties,
                render: props => config.render(propsAdjuster(props))
            };

        const factory = defineFunctionalComponent(adjustedConfig);

        factory.meta = Object.assign({}, config, {
            functional: true
        });

        return factory;
    };

    return ret;
}

function enhanceDefineStandardComponent(defineStandardComponent) {
    return cfg => {
        const err = validateConfigForStandardComponent(cfg);

        if (err) {
            throw err;
        }

        const
            config = normalizeComponentConfig(cfg),
            propsAdjuster = createPropsAdjuster(config),
    
            adjustedConfig = Object.assign({}, config, {
                init: (viewConsumer, stateConsumer, platformComponent) => {
                    const
                        result = config.init(viewConsumer, stateConsumer, platformComponent),
                        err = validateInitResult(result, config);

                    if (err) {
                        throw err;
                    }

                    return Object.assign({}, result, {
                        propsConsumer(props) {
                            const props2 = props === undefined
                                ? undefined
                                : propsAdjuster(props);


                            result.propsConsumer(props2);
                        }
                    });
                }
            });

        const factory = defineStandardComponent(adjustedConfig);

        factory.meta = Object.assign({}, config, {
            functional: 'false'
        });

        return factory;
    };
}