import adaptCreateElement from './adapt/adaptCreateElement.js';
import adaptReactifiedDefineComponent from './adapt/adaptReactifiedDefineComponent';
import adaptMount from './adapt/adaptMount.js';
import unmount from './component/unmount.js';
import Config from './system/Config';

import React from 'react';
import ReactDOM from 'react-dom';

const
    defineComponent = adaptReactifiedDefineComponent({
        createElement: React.createElement,
        ComponentClass: React.Component
    }),

    createElement = adaptCreateElement({
        createElement: React.createElement,
        isElement: React.isValidElement
    }),

    isElement = React.isValidElement,

    reactMount = (content, targetNode) => {
        ReactDOM.render(content, targetNode);

        return () => ReactDOM.unmountComponentAtNode(targetNode);
    },

    mount = adaptMount(reactMount, isElement),

    Adapter = {
        name: 'react',
        api: { React, ReactDOM }
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
