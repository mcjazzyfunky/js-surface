import adaptReactLikeRenderEngine from './adaption/adaptReactLikeRenderEngine';

import React from 'react';
import ReactNative from 'react-native';

const {
    createElement,
    defineComponent,
    isElement,
    isRenderable,
    mount,
    unmount,
    Adapter,
    Config 
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
    defineComponent,
    isElement,
    isRenderable,
    mount,
    unmount,
    Adapter,
    Config
};


function reactNativeMount(Component) {
    ReactNative.AppRegistry.registerComponent('AppMainComponent', () => Component);
}
