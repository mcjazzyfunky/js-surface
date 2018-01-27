import adaptCreateElement from './adaption/adaptCreateElement';
import adaptReactifiedDefineComponent from './adaption/adaptReactifiedDefineComponent';
import adaptMount from './adaption/adaptMount';
import convertIterablesToArrays from './util/convertIterablesToArrays';
import unmount from './component/unmount.js';
import Config from './config/Config';
import ElementInspector from './helper/ElementInspector';

import Preact from 'preact';

const
    VNode = Preact.h('').constructor,

    defineComponent = adaptReactifiedDefineComponent({
        createElement: Preact.h, 
        ComponentClass: Preact.Component 
    }),

    isElement = it => it instanceof VNode,

    createElement = adaptCreateElement({
        createElement: Preact.h,
        attributeAliases: null,
        attributeAliasesByTagName: null,
        argumentsMapper: convertIterablesToArrays
    }),

    preactMount = (content, targetNode) => {
        Preact.render(content, targetNode);

        return () => Preact.render('', targetNode);
    },

    mount = adaptMount(preactMount, isElement),

    Adapter = Object.freeze({
        name: 'preact',
        api: { Preact }
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
