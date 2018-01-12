import adaptCreateElement from './adapt/adaptCreateElement.js';
import adaptReactifiedDefineComponent from './adapt/adaptReactifiedDefineComponent';
import adaptMount from './adapt/adaptMount.js';
import convertIterablesToArrays from './util/convertIterablesToArrays';
import unmount from './component/unmount.js';
import Config from './system/Config';

import Inferno from 'inferno';
import infernoCreateElement from 'inferno-create-element';
import InfernoComponent from 'inferno-component';

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

    createElement = adaptCreateElement({
        createElement: adjustedCreateElement,
        isElement
    }),

    infernoMount = (content, targetNode) => {
        Inferno.render(content, targetNode);

        return () => Inferno.render(null, targetNode);
    },

    mount = adaptMount(infernoMount, isElement),

    Adapter = {
        name: 'inferno',
        api: { Inferno: InfernoAPI }
    };

export {
    createElement,
    defineComponent,
    isElement,
    mount,
    unmount,
    Adapter,
    Config
};
