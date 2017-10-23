import adaptReactLikeRenderEngine from './adaption/adaptReactLikeRenderEngine';

import React from 'react';
import ReactDOM from 'react-dom';

function reactMount(content, targetNode) {
    ReactDOM.render(content, targetNode);

    return () => ReactDOM.unmountComponentAtNode(targetNode);
}

const {
    createElement,
    defineComponent,
    defineClassComponent,
    defineFunctionalComponent,
    defineStandardComponent,
    hyperscript,
    isElement,
    isRenderable,
    mount,
    unmount,
    Adapter,
    Config
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
    defineComponent,
    isElement,
    isRenderable,
    mount,
    unmount,
    Adapter,
    Config
};
