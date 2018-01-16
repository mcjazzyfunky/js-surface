import adaptCreateElement from './adapt/adaptCreateElement';
import adaptHyperscript from './adapt/adaptHyperscript';
import adaptReactifiedDefineComponent from './adapt/adaptReactifiedDefineComponent';
import adaptMount from './adapt/adaptMount';
import convertIterablesToArrays from './util/convertIterablesToArrays';
import unmount from './component/unmount.js';
import Config from './config/Config';

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
        isElement,
        classAttributeName: 'className',
        attributeAliases: null,
        attributeAliasesByTagName: null
    }),

    hyperscript = adaptHyperscript({
        createElement: adjustedCreateElement,
        isElement,
        classAttributeName: 'className',
        attributeAliases: null,
        attributeAliasesByTagName: null
    }),

    preactMount = (content, targetNode) => {
        Preact.render(content, targetNode);

        return () => Preact.render('', targetNode);
    },

    mount = adaptMount(preactMount, isElement),

    Adapter = Object.freeze({
        name: 'preact',
        api: { Preact }
    });

export {
    createElement,
    defineComponent,
    hyperscript,
    isElement,
    mount,
    unmount,
    Adapter,
    Config
};
