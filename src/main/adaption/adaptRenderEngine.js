import adaptDefineComponent from './adaptDefineComponent';
import adaptHyperscript from './adaptHyperscript';
import adaptMount from '../adaption/adaptMount';
import enrichComponentFactory from '../helper/enrichComponentFactory';
import normalizeComponentConfig from '../helper/normalizeComponentConfig';
import createPropsAdjuster from '../helper/createPropsAdjuster';
import Adapter from '../system/Adapter';
import AdapterValues from '../system/AdapterValues';
import Config from '../system/Config';
import ConfigValues from '../system/ConfigValues';

import validateInitResult from '../validation/validateInitResult';

export default function adaptRenderEngine(config) {
    if (AdapterValues.name !== null) {
        throw new Error('[adaptRenderEngine] Function may only be called once');
    }

    const err = null; // TODO

    if (err) {
        throw new Error(
            "Illegal first argument 'config' for "
            + "function 'adaptRenderEngine':"
            + err);
    }

    AdapterValues.name = config.renderEngine.name;
    AdapterValues.api = config.renderEngine.api;
    
    const
        hyperscript = 
            config.options && config.options.isBrowserBased === false
                ? null
                : adaptHyperscript(config.interface.createElement, config.interface.isElement, Adapter),

        defineFunctionalComponent = enhanceDefineFunctionalComponent(config.interface.defineFunctionalComponent),
        defineStandardComponent = enhanceDefineStandardComponent(config.interface.defineStandardComponent),
        
        defineComponent = adaptDefineComponent(
            defineFunctionalComponent, defineStandardComponent);
        
    const ret = {
        createElement: hyperscript || config.interface.createElement,
        defineComponent,
        isElement: config.interface.isElement,
        mount: adaptMount(config.interface.mount, config.interface.isElement),
        unmount,
        Adapter,
        Config
    };

    if (hyperscript) {
        ret.hyperscript = hyperscript;
    }

    return ret;
}

function enhanceDefineFunctionalComponent(defineFunctionalComponent) {
    const ret = cfg => {
        if (ConfigValues.validateDefs) {
            const err = null; // TODO!!!
            
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
                render: props => config.render(propsAdjuster(props, ConfigValues.validateProps))
            };

        const factory = defineFunctionalComponent(adjustedConfig);

        enrichComponentFactory(factory, config, ret);

        return factory;
    };

    return ret;
}

function enhanceDefineStandardComponent(defineStandardComponent) {
    const ret = cfg => {
        if (ConfigValues.validateDefs) {
            const err =  null; // TODO

            if (err) {
                throw err;
            }
        }

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

        const factory = defineStandardComponent(adjustedConfig);
        
        enrichComponentFactory(factory, config, ret);

        return factory;
    };
    
    return ret;
}

function unmount(target) {
    let ret = false;

    const
        targetNode = typeof target === 'string'
            ? document.getElementById(target)
            : target;
    
    if (targetNode && targetNode.tagName) {
        const unmountComponent = targetNode[Symbol.for('js-surface:unmount')];

        if (typeof unmountComponent === 'function') {
            unmountComponent();            
        }
    }
    
    return ret;
}