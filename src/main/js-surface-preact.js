import adaptCreateElement from './adapt/adaptCreateElement.js';
import adaptReactifiedDefineComponent from './adapt/adaptReactifiedDefineComponent';
import adaptMount from './adapt/adaptMount.js';
import convertIterablesToArrays from './util/convertIterablesToArrays';
import unmount from './component/unmount.js';
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
