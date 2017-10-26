import adaptReactLikeComponentSystem from './adaption/adaptReactLikeComponentSystem';

import React from 'react';
import ReactDOM from 'react-dom';

function reactMount(content, targetNode) {
    ReactDOM.render(content, targetNode);

    return () => ReactDOM.unmountComponentAtNode(targetNode);
}

const {
    createElement,
    defineComponent,
    isElement,
    mount,
    unmount,
    Adapter,
    Config
} = adaptReactLikeComponentSystem({
    name: 'react',
    api: { React, ReactDOM },
    createElement: React.createElement,
    createFactory: React.createFactory,
    isValidElement: React.isValidElement,
    mount: reactMount,
    Component: React.Component,
    browserBased: true
});

export {
    createElement,
    defineComponent,
    isElement,
    mount,
    unmount,
    Adapter,
    Config
};
