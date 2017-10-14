import adaptCreateElement from './adaptCreateElement';
import adaptIsRenderable from './adaptIsRenderable';
import adaptMount from '../adaption/adaptMount';
import convertClassComponentConfig from '../conversion/convertClassComponentConfig';
import enrichComponentFactory from '../helper/enrichComponentFactory';
import normalizeComponentConfig from '../helper/normalizeComponentConfig';
import createPropsAdjuster from '../helper/createPropsAdjuster';
import { Adapter, Config, ComponentSystem } from '../system/system';

import validateStandardComponentConfig from '../validation/validateStandardComponentConfig';
import validateFunctionalComponentConfig from '../validation/validateFunctionalComponentConfig';
import validateInitResult from '../validation/validateInitResult';

import { Spec } from 'js-spec';

import shapeOfAdaptRenderEngineConfig
    from './../shape/shapeOfAdaptRenderEngineConfig';

export default function adaptRenderEngine(config) {
    if (Adapter.name !== null) {
        throw new Error('[adaptRenderEngine] Function may only be called once');
    }

    const err =
        Spec.shape(shapeOfAdaptRenderEngineConfig)
            .validate(config, '');

    if (err) {
        throw new Error(
            "Illegal first argument 'config' for "
            + "function 'adaptRenderEngine':"
            + err);
    }

    Adapter.name = config.renderEngine.name;
    Adapter.api = config.renderEngine.api;
    
    const
        createElement = config.options && config.options.isBrowserBased === false
            ? config.interface.createElement
            : adaptCreateElement(config.interface.createElement, config.interface.isElement, Adapter),

        defineFunctionalComponent = enhanceDefineFunctionalComponent(config.interface.defineFunctionalComponent),
        defineStandardComponent = enhanceDefineStandardComponent(config.interface.defineStandardComponent),
        
        defineClassComponent = config => defineStandardComponent(
            convertClassComponentConfig(config)); 

    return {
        createElement,
        defineFunctionalComponent,
        defineStandardComponent,
        defineClassComponent,
        isElement: config.interface.isElement,
        isRenderable: adaptIsRenderable(config.interface.isElement),
        mount: adaptMount(config.interface.mount, config.interface.isElement),
        ComponentSystem
    };
}

function enhanceDefineFunctionalComponent(defineFunctionalComponent) {
    const ret = cfg => {
        if (Config.validateDefinitions) {
            const err = validateFunctionalComponentConfig(cfg);

            if (err) {
                throw err;
            }
        }

        const
            config = normalizeComponentConfig(cfg),
            propsAdjuster = createPropsAdjuster(config),

            adjustedConfig = {
                displayName:  config.displayName,
                properties: config.properties,
                render: props => config.render(propsAdjuster(props, Config.validateProperties))
            };

        const factory = defineFunctionalComponent(adjustedConfig);

        enrichComponentFactory(factory, config, ret);

        return factory;
    };

    return ret;
}

function enhanceDefineStandardComponent(defineStandardComponent) {
    const ret = cfg => {
        if (Config.validateDefinitions) {
            const err = validateStandardComponentConfig(cfg);

            if (err) {
                throw err;
            }
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
                                : propsAdjuster(props, Config.validateProperties);


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
