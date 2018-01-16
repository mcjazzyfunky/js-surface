import adaptCreateElement from './adapt/adaptCreateElement';
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

    createElement = adaptCreateElement({
        createElement: React.createElement,
        isElement: React.isValidElement,
        classAttributeName: 'className',
        attributeAliases: null,
        attributeAliasesByTagName: { label: { 'for': 'htmlFor' } }
    }),
    
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
