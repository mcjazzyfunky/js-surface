import adaptDefineComponent from './adaptDefineComponent';
import adaptHyperscript from './adaptHyperscript';
import adaptMount from '../adaption/adaptMount';
import validateComponentSystemConfig from '../validation/validateComponentSystemConfig';
import Adapter from '../system/Adapter';
import AdapterValues from '../system/AdapterValues';
import Config from '../system/Config';

export default function adaptComponentSystem(config) {
    if (AdapterValues.name !== null) {
        throw new Error('[adaptComponentSystem] Function may only be called once');
    }

    const err = validateComponentSystemConfig(config);

    if (err) {
        throw new TypeError(
            "[adaptComponentSystem] Illegal first argument 'config' for "
            + "function 'adaptComponentSystem':"
            + err);
    }

    AdapterValues.name = config.name;
    AdapterValues.api = config.api;
    
    const
        hyperscript = 
            config.needsHyperscript === false
                ? null
                : adaptHyperscript(config.createElement, config.isElement, Adapter),

        defineComponent = adaptDefineComponent(
            config.defineComponent);
        
    const ret = {
        createElement: hyperscript || config.createElement,
        defineComponent,
        isElement: config.isElement,
        mount: adaptMount(config.mount, config.isElement),
        unmount,
        Adapter,
        Config
    };

    if (hyperscript) {
        ret.hyperscript = hyperscript;
    }

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