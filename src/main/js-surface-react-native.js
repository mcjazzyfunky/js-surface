import adaptReactLikeComponentSystem from './internal/component/adaption/adaptReactLikeComponentSystem.js';

import React from 'react';
import AppRegistry from 'react-native';

const {
    createElement,
    defineDispatchComponent,
    defineClassComponent,
    defineFunctionalComponent,
    defineStandardComponent,
    isElement,
    isRenderable,
    render,
    Component
} = adaptReactLikeComponentSystem({
    createElement: React.createElement,
    createFactory: React.createFactory,
    isValidElement: React.isValidElement,
    render: reactNativeRender,
    Component: React.Component,
    isBrowserBased: false
});

export {
    createElement,
    defineDispatchComponent,
    defineClassComponent,
    defineFunctionalComponent,
    defineStandardComponent,
    isElement,
    isRenderable,
    render,
    Component
};


function reactNativeRender(Component) {
    AppRegistry.registerComponent('AppMainComponent', () => Component);
}
