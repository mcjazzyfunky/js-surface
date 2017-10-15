import adaptReactLikeRenderEngine from './adaption/adaptReactLikeRenderEngine';

import React from 'react';
import ReactDOM from 'react-dom';

function reactMount(content, targetNode) {
    ReactDOM.render(content, targetNode);

    return () => ReactDOM.unmountComponentAtNode(targetNode);
}

const {
    createElement,
    defineClassComponent,
    defineFunctionalComponent,
    defineStandardComponent,
    hyperscript,
    isElement,
    isRenderable,
    mount,
    unmount,
    ComponentSystem
} = adaptReactLikeRenderEngine({
    renderEngineName: 'react',
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
    hyperscript,
    isElement,
    isRenderable,
    mount,
    unmount,
    ComponentSystem
};
