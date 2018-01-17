import adaptComponentClass from './adapt/adaptComponentClass';
import adaptHyperscript from './adapt/adaptHyperscript';
import adaptReactifiedDefineComponent from './adapt/adaptReactifiedDefineComponent';
import adaptMount from './adapt/adaptMount.js';
import unmount from './component/unmount.js';
import Config from './config/Config';

import React from 'react';
import ReactDOM from 'react-dom';

const
    defineComponent = adaptReactifiedDefineComponent({
        createElement: React.createElement,
        ComponentClass: React.Component
    }),

    cache = {},

    createElement = function (...args)  {
        //const args = arguments;
        const type = args[0];
        
        let ret;
        
        if (type && type.isComponentFactory) {
            const
                length = args.length,
                newArgs = new Array(length - 1);

            for (let i = 1; i < length; ++i) {
                newArgs[i] = args[i];
            }

            ret = type(...args);
        } else if (type) {
            ret = React.createElement(...args);
        } else {
          //     const data = cache[type];

            ret = React.createElement(...args);
        }

        return ret;
    },

    hyperscript = adaptHyperscript({
        createElement: React.createElement,
        isElement: React.isValidElement,
        classAttributeName: 'className',
        attributeAliases: null,
        attributeAliasesByTagName: { label: { 'for': 'htmlFor' } }
    }),

    isElement = React.isValidElement,

    reactMount = (content, targetNode) => {
        ReactDOM.render(content, targetNode);

        return () => ReactDOM.unmountComponentAtNode(targetNode);
    },

    mount = adaptMount(reactMount, isElement),

    Adapter = Object.freeze({
        name: 'react',
        api: { React, ReactDOM }
    }),
    
    Component = adaptComponentClass(defineComponent);

export {
    createElement,
    defineComponent,
    hyperscript,
    isElement,
    mount,
    unmount,
    Adapter,
    Component,
    Config
};
