import adaptReactLikeComponentSystem from './internal/adaption/adaptReactLikeComponentSystem.js';

import React from 'react';
import ReactNative from 'react-native';

const {
    createElement,
    defineComponent,
    isElement,
    isRenderable,
    render,
    Component,
    ComponentSystem
} = adaptReactLikeComponentSystem({
    componentSystemName: 'react-native',
    componentSystemAPI: { React, ReactNative },
    createElement: React.createElement,
    createFactory: React.createFactory,
    isValidElement: React.isValidElement,
    render: reactNativeRender,
    Component: React.Component,
    isBrowserBased: false
});

export {
    createElement,
    defineComponent,
    isElement,
    isRenderable,
    render,
    Component,
    ComponentSystem
};


function reactNativeRender(Component) {
    ReactNative.AppRegistry.registerComponent('AppMainComponent', () => Component);
}
