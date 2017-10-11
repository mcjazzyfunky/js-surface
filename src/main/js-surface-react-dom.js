import adaptReactLikeRenderEngine from './adaption/adaptReactLikeRenderEngine';

import React from 'react';
import ReactDOM from 'react-dom';

function reactRender(content, targetNode) {
    if (!isElement(content)) {
        throw new TypeError(
            "[render] First argument 'content' has to be a valid element");
    }

    const target =
        typeof targetNode === 'string'
            ? document.getElementById(targetNode)
            : target;

    if (target) {
        let cleanedUp = false;

        const cleanUp = () => {
            if (!cleanedUp) {
                cleanedUp = true;
                ReactDOM.unmountComponentAtNode(target.firstChild);
            }
        };

        target.innerHTML = '<span></span>';
        target.firstChild.addEventListener('DOMNodeRemoved', cleanUp);        
        ReactDOM.render(content, target.firstChild);

        return { dispose: cleanUp };
    }
}

const {
    createElement,
    defineClassComponent,
    defineFunctionalComponent,
    defineStandardComponent,
    isElement,
    isRenderable,
    render,
    RenderEngine
} = adaptReactLikeRenderEngine({
    renderEngineName: 'react-dom',
    renderEngineAPI: { React, ReactDOM },
    createElement: React.createElement,
    createFactory: React.createFactory,
    isValidElement: React.isValidElement,
    render: reactRender,
    Component: React.Component
});

export {
    createElement,
    defineClassComponent,
    defineFunctionalComponent,
    defineStandardComponent,
    isElement,
    isRenderable,
    render,
    RenderEngine
};
