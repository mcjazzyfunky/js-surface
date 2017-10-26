import adaptReactLikeComponentSystem from './adaption/adaptReactLikeComponentSystem';

import React from 'react';
import ReactNative from 'react-native';

const {
    createElement,
    defineComponent,
    isElement,
    mount,
    unmount,
    Adapter,
    Config 
} = adaptReactLikeComponentSystem({
    name: 'react-native',
    api: { React, ReactNative },
    createElement: React.createElement,
    createFactory: React.createFactory,
    isValidElement: React.isValidElement,
    mount: reactNativeMount,
    Component: React.Component,
    needsHyperscript: false
});

export {
    createElement,
    defineComponent,
    isElement,
    mount,
    unmount,
    Adapter,
    Config
};


function reactNativeMount(Component) {
    ReactNative.AppRegistry.registerComponent('AppMainComponent', () => Component);
}
