import adaptReactLikeComponentSystem from './internal/adaption/adaptReactLikeComponentSystem.js';

import React from 'react';
import ReactDOM from 'react-dom';

function reactRender(content, targetNode) {
    if (!isElement(content)) {
        throw new TypeError(
            "[render] First argument 'content' has to be a valid element");
    }

    if (typeof targetNode === 'string') {
        targetNode = document.getElementById(targetNode);
    }

    return ReactDOM.render(content, targetNode);
}

const {
    createElement,
    defineComponent,
    isElement,
    isRenderable,
    render,
    Component
} = adaptReactLikeComponentSystem({
    createElement: React.createElement,
    createFactory: React.createFactory,
    isValidElement: React.isValidElement,
    render: reactRender,
    Component: React.Component
});

export {
    createElement,
    defineComponent,
    isElement,
    isRenderable,
    render,
    Component
};
