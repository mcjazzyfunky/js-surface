import adaptReactLikeRenderEngine from './adaption/adaptReactLikeRenderEngine';

import React from 'react';
import ReactDOM from 'react-dom';

function reactMount(content, targetNode) {
    if (!isElement(content)) {
        throw new TypeError(
            "[mount] First argument 'content' has to be a valid element");
    }

    const target =
        typeof targetNode === 'string'
            ? document.getElementById(targetNode)
            : target;

    if (target) {
        target.innerHTML = '<span></span>';
        
        const container = target.firstChild;
        
        let cleanedUp = false;

        const cleanUp = event => {
            if (!cleanedUp && (!event || event.target === container)) {
                cleanedUp = true;
                container.removeEventListener('DOMNodeRemoved', cleanUp);
                ReactDOM.unmountComponentAtNode(container);
                container.innerHTML = '';
            }
        };

        container.addEventListener('DOMNodeRemoved', cleanUp, false);        
        ReactDOM.render(content, container);

        return { unmount: () => cleanUp() };
    }
}

const {
    createElement,
    defineClassComponent,
    defineFunctionalComponent,
    defineStandardComponent,
    isElement,
    isRenderable,
    mount,
    RenderEngine
} = adaptReactLikeRenderEngine({
    renderEngineName: 'react-dom',
    renderEngineAPI: { React, ReactDOM },
    createElement: React.createElement,
    createFactory: React.createFactory,
    isValidElement: React.isValidElement,
    mount: reactMount,
    Component: React.Component
});

export {
    createElement,
    defineClassComponent,
    defineFunctionalComponent,
    defineStandardComponent,
    isElement,
    isRenderable,
    mount,
    RenderEngine
};
