import adaptCreateElement from './adaption/adaptCreateElement';
import adaptReactifiedDefineComponent from './adaption/adaptReactifiedDefineComponent';
import adaptMount from './adaption/adaptMount';
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
        // 28: component, 3970: element
        !!it && typeof it === 'object' && !!(it.flags & (28 | 3970)),

    createElement = adaptCreateElement({
        createElement: infernoCreateElement,
        attributeAliases: null,
        attributeAliasesByTagName: { label: { htmlFor: 'for' } },
        argumentsMapper:  convertIterablesToArrays
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
    };

export {
    createElement,
    defineComponent,
    inspectElement,
    isElement,
    mount,
    unmount,
    Adapter,
    Config
};
