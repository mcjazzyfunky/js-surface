import adaptComponentClass from './adapt/adaptComponentClass';
import adaptCreateElement from './adapt/adaptCreateElement';
import adaptHyperscript from './adapt/adaptHyperscript';
import adaptReactifiedDefineComponent from './adapt/adaptReactifiedDefineComponent';
import adaptMount from './adapt/adaptMount';
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
        isElement,
        classAttributeName: 'className',
        attributeAliases: null,
        attributeAliasesByTagName: null,
        argumentsMapper: convertIterablesToArrays
    }),

    hyperscript = adaptHyperscript({
        createElement: Preact.h,
        isElement,
        classAttributeName: 'className',
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
    },

    Component = adaptComponentClass(defineComponent)

export {
    createElement,
    defineComponent,
    inspectElement,
    hyperscript,
    isElement,
    mount,
    unmount,
    Adapter,
    Component,
    Config
};
