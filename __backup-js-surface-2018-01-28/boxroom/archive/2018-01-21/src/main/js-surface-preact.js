import adaptComponentClass from './adaption/adaptComponentClass';
import adaptCreateElement from './adaption/adaptCreateElement';
import adaptHyperscript from './adaption/adaptHyperscript';
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
