import adaptReactLikeComponentSystem from './internal/adaption/adaptReactLikeComponentSystem.js';

import React from 'react';
import AppRegistry from 'react-native';

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
    AppRegistry.registerComponent('AppMainComponent', () => Component);
}
