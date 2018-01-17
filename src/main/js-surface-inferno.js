import adaptComponentClass from './adapt/adaptComponentClass';
import adaptHyperscript from './adapt/adaptHyperscript';
import adaptReactifiedDefineComponent from './adapt/adaptReactifiedDefineComponent';
import adaptMount from './adapt/adaptMount';
import convertIterablesToArrays from './util/convertIterablesToArrays';
import unmount from './component/unmount.js';
import Config from './config/Config';
import ElementInspector from './helper/ElementInspector';

import Inferno from 'inferno';
import iceExport from 'inferno-create-element';
import InfernoComponent from 'inferno-component';

// This is just that both Inferno 3.x and Infero 4.x is supported.
// Just a temporary solution.
const infernoCreateElement =
    typeof iceExport === 'function'
        ? iceExport
        : iceExport.createElement; 

const InfernoAPI = Object.assign({}, Inferno, {
    createElement: infernoCreateElement,
    Component: InfernoComponent     
});

// Get rid of internal functions
for (const key of Object.keys(Inferno)) {
    if (key.startsWith('internal')) {
        delete Inferno[key];
    }
}

const
    defineComponent = adaptReactifiedDefineComponent({
        createElement: infernoCreateElement, 
        ComponentClass: InfernoComponent 
    }),

    isElement = it =>
        !!it && typeof it === 'object' && !!(it.flags & (28 | 3970)),
        // 28: component, 3970: element

    adjustedCreateElement = (...args) => {
        const convertedArgs = convertIterablesToArrays(args);

        return infernoCreateElement.apply(null, convertedArgs);
    },

    createElement = function (...args) {
        const
            type = args[0],
            convArgs = convertIterablesToArrays(args);
        
        let ret;
        
        if (type && type.isComponentFactory === true) {
            const
                length = args.length,
                newArgs = new Array(length - 1);

            for (let i = 1; i < length; ++i) {
                newArgs[i] = convArgs[i];
            }

            ret = type(...newArgs);
        } else {
            ret = infernoCreateElement(...convArgs);
        }

        return ret;
    },


    hyperscript = adaptHyperscript({
        createElement: adjustedCreateElement,
        isElement,
        classAttributeName: 'className',
        attributeAliases: null,
        attributeAliasesByTagName: { label: { htmlFor: 'for' } }
    }),

    infernoMount = (content, targetNode) => {
        Inferno.render(content, targetNode);

        return () => Inferno.render(null, targetNode);
    },

    mount = adaptMount(infernoMount, isElement),

    Adapter = Object.freeze({
        name: 'inferno', 
        api: { Inferno: InfernoAPI }
    }),
    
    inspectElement = obj => {
        let ret = null;

        if (isElement(obj)) {
            ret = new ElementInspector(obj.type, obj.props);
        }

        return ret;
    },

    Component = adaptComponentClass(defineComponent);

export {
    createElement,
    defineComponent,
    hyperscript,
    inspectElement,
    isElement,
    mount,
    unmount,
    Adapter,
    Component,
    Config
};
