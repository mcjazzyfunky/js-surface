import adaptCreateElement from './adaptCreateElement';
import adaptIsRenderable from './adaptIsRenderable';
import convertClassComponentConfig from '../conversion/convertClassComponentConfig';
import enrichComponentFactory from '../helper/enrichComponentFactory';
import normalizeComponentConfig from '../helper/normalizeComponentConfig';
import createPropsAdjuster from '../helper/createPropsAdjuster';

import validateConfigForStandardComponent from '../validation/validateStandardComponentConfig';
import validateInitResult from '../validation/validateInitResult';

import { Spec } from 'js-spec';

import shapeOfAdaptRenderEngineConfig
    from './../shape/shapeOfAdaptRenderEngineConfig';

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
        RenderEngine = {
            name: config.renderEngine.name,
            api: config.renderEngine.api
        },

        createElement = config.options && config.options.isBrowserBased === false
            ? config.interface.createElement
            : adaptCreateElement(config.interface.createElement, config.interface.isElement, RenderEngine),

        defineFunctionalComponent = enhanceDefineFunctionalComponent(config.interface.defineFunctionalComponent),
        defineStandardComponent = enhanceDefineStandardComponent(config.interface.defineStandardComponent),
        
        defineClassComponent = config => defineStandardComponent(
            convertClassComponentConfig(config)); 

    Object.freeze(RenderEngine);

    return {
        RenderEngine: RenderEngine,
        createElement,
        defineFunctionalComponent,
        defineStandardComponent,
        defineClassComponent,
        isElement: config.interface.isElement,
        isRenderable: adaptIsRenderable(config.interface.isElement),
        mount: config.interface.mount
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

        enrichComponentFactory(factory, config, ret);

        return factory;
    };

    return ret;
}

function enhanceDefineStandardComponent(defineStandardComponent) {
    const ret = cfg => {
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
                        receiveProps(props) {
                            const props2 = props === undefined
                                ? undefined
                                : propsAdjuster(props);


                            result.receiveProps(props2);
                        }
                    });
                }
            });

        const factory = defineStandardComponent(adjustedConfig);
        
        enrichComponentFactory(factory, config, ret);

        return factory;
    };
    
    return ret;
}
