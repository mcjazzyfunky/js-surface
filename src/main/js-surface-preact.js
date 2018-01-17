import adaptComponentClass from './adapt/adaptComponentClass';
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

    createElement = (...args) => {
        const
            type = args[0],
            convArgs = convertIterablesToArrays(args);
        
        if (type && type.isComponentFactory === true) {
            convArgs[0] = type.type;
        } 

        return Preact.h(...convArgs);
    },

    hyperscript = adaptHyperscript({
        createElement,
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
