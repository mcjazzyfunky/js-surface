import Component from './Component.js';
import defineClassComponent from '../internal/class-based/defineClassComponent.js';
import adaptCreateElement from '../internal/adaption/adaptCreateElement.js';
import adaptIsRenderable from '../internal/adaption/adaptIsRenderable.js';
import createPropsAdjuster from '../internal/helper/createPropsAdjuster.js';

import validateConfigForStandardComponent from '../internal/validation/validateStandardComponentConfig.js';
import validateInitResult from '../internal/validation/validateInitResult.js';

import { Spec } from 'js-spec';

import shapeOfAdaptComponentSystemConfig
    from './../internal/shape/shapeOfAdaptComponentSystemConfig.js';

export default function adaptComponentSystem(config) {
    const err = Spec.shape(shapeOfAdaptComponentSystemConfig)(config);

    if (err) {
        throw new Error(
            "Illegal first argument 'config' for "
            + "function 'adaptComponentSystem':"
            + err);
    }
    
    const
        createElement = config.options && config.options.isBrowserBased === false
            ? config.interface.createElement
            : adaptCreateElement(config.interface.createElement, config.interface.isElement),

        defineFunctionalComponent = enhanceDefineFunctionalComponent(config.interface.defineFunctionalComponent),
        defineStandardComponent = enhanceDefineStandardComponent(config.interface.defineStandardComponent);

    const ComponentSystem = {
        name: config.componentSystem.name,
        api: config.componentSystem.api
    };

    Object.freeze(ComponentSystem);

    return {
        ComponentSystem,
        createElement,

        defineComponent(cfg) {
            let ret;

            if (cfg.init) {
                ret = defineStandardComponent(cfg);
                ret.meta = Object.assign({ kind: 'standard' }, cfg);
            } else if (cfg.render) {
                ret = defineFunctionalComponent(cfg);
                ret.meta = Object.assign({ kind: 'functional' }, cfg);
            } else if (typeof cfg === 'function') {
                ret = defineClassComponent(cfg);
                
                ret.meta = Object.assign({
                    kind: 'class-based',
                    displayName: cfg.displayName,
                    componentClass: cfg
                }, cfg);
            } else {
                throw new Error('[defineComponent] Illegal configuration');
            }

            Object.freeze(ret.meta);
            Object.freeze(ret);

            return ret;
        },

        isElement: config.interface.isElement,
        isRenderable: adaptIsRenderable(config.interface.isElement),
        render: config.interface.render,
        Component
    };
}

function enhanceDefineFunctionalComponent(defineFunctionalComponent) {
    const ret = config => {
        const
            propsAdjuster = createPropsAdjuster(config),

            adjustedConfig = {
                displayName:  config.displayName,
                properties: config.properties,
                render: props => config.render(propsAdjuster(props))
            };
    
        return defineFunctionalComponent(adjustedConfig);
    };

    return ret;
}

function enhanceDefineStandardComponent(defineStandardComponent) {
    return config => {
        const err = validateConfigForStandardComponent(config);

        if (err) {
            throw err;
        }

        const
            propsAdjuster = createPropsAdjuster(config),
    
            adjustedConfig = Object.assign({}, config, {
                init: (viewConsumer, stateConsumer = null) => {
                    const
                        result = config.init(viewConsumer, stateConsumer),
                        err = validateInitResult(result, config);

                    if (err) {
                        throw err;
                    }

                    return Object.assign({}, result, {
                        propsConsumer(props) {
                            result.propsConsumer(propsAdjuster(props));
                        }
                    });
                }
            });

        return defineStandardComponent(adjustedConfig);
    };
}
