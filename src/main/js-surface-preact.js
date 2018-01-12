import adaptCreateElement from './util/adaptCreateElement.js';
import adaptReactifiedDefineComponent from './util/adaptReactifiedDefineComponent';
import adaptMount from './util/adaptMount.js';
import convertIterablesToArrays from './util/convertIterablesToArrays';
import unmount from './util/unmount.js';
import Config from './system/Config';

import Preact from 'preact';

const
    VNode = Preact.h('').constructor,

    defineComponent = adaptReactifiedDefineComponent({
        createElement: Preact.h, 
        ComponentClass: Preact.Component 
    }),

    isElement = it => it instanceof VNode,

    adjustedCreateElement = (...args) => {
        const convertedArgs = convertIterablesToArrays(args);

        return Preact.h.apply(null, convertedArgs);
    },

    createElement = adaptCreateElement({
        createElement: adjustedCreateElement,
        isElement
    }),

    preactMount = (content, targetNode) => {
        Preact.render(content, targetNode);

        return () => Preact.render('', targetNode);
    },

    mount = adaptMount(preactMount, isElement),

    Adapter = {
        name: 'preact',
        api: { Preact }
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
