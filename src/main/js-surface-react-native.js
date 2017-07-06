import adaptReactLikeRenderEngine from './internal/adaption/adaptReactLikeRenderEngine.js';

import React from 'react';
import ReactNative from 'react-native';

const {
    createElement,
    defineClassComponent,
    defineFunctionalComponent,
    defineStandardComponent,
    isElement,
    isRenderable,
    render,
    Component,
    RenderEngine
} = adaptReactLikeRenderEngine({
    renderEngineName: 'react-native',
    renderEngineAPI: { React, ReactNative },
    createElement: React.createElement,
    createFactory: React.createFactory,
    isValidElement: React.isValidElement,
    render: reactNativeRender,
    Component: React.Component,
    isBrowserBased: false
});

export {
    createElement,
    defineClassComponent,
    defineFunctionalComponent,
    defineStandardComponent,
    isElement,
    isRenderable,
    render,
    Component,
    RenderEngine
};


function reactNativeRender(Component) {
    ReactNative.AppRegistry.registerComponent('AppMainComponent', () => Component);
}
