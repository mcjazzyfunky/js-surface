import adaptReactLikeRenderEngine from './adaption/adaptReactLikeRenderEngine';

import React from 'react';
import ReactNative from 'react-native';

const {
    createElement,
    defineClassComponent,
    defineFunctionalComponent,
    defineStandardComponent,
    isElement,
    isRenderable,
    mount,
    unmount,
    RenderEngine
} = adaptReactLikeRenderEngine({
    renderEngineName: 'react-native',
    renderEngineAPI: { React, ReactNative },
    createElement: React.createElement,
    createFactory: React.createFactory,
    isValidElement: React.isValidElement,
    mount: reactNativeMount,
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
    mount,
    unmount,
    RenderEngine
};


function reactNativeMount(Component) {
    ReactNative.AppRegistry.registerComponent('AppMainComponent', () => Component);
}
