import defineClassComponent from './defineClassComponent.js';
import defineDispatchComponent from './defineDispatchComponent.js';
import Component from './Component.js';
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
    
    const createElement = config.isBrowserBased === false
        ? config.createElement
        : adaptCreateElement(config.createElement, config.isElement);

    return {
        createElement,
        defineClassComponent,
        defineDispatchComponent,
        defineFunctionalComponent: enhanceDefineFunctionalComponent(config.defineFunctionalComponent),
        defineStandardComponent: enhanceDefineStandardComponent(config.defineStandardComponent),
        isElement: config.isElement,
        isRenderable: adaptIsRenderable(config.isElement),
        render: config.render,
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
                init: (viewCallback, stateCallback = null) => {
                    const
                        result = config.init(viewCallback, stateCallback),
                        err = validateInitResult(result, config);

                    if (err) {
                        throw err;
                    }

                    return {
                        propsCallback(props) {
                            result.propsCallback(propsAdjuster(props));
                        },
                        instance: result.instance 
                    };
                }
            });

        return defineStandardComponent(adjustedConfig);
    };
}
