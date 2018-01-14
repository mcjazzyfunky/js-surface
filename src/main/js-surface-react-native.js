import adaptReactifiedDefineComponent from './adapt/adaptReactifiedDefineComponent';
import Config from './config/Config';

import React from 'react';
import ReactNative from 'react-native';

const
    defineComponent = adaptReactifiedDefineComponent({
        createElement: React.createElement,
        ComponentClass: React.Component
    }),

    createElement = React.createElement, 

    isElement = React.isValidElement,

    mount = ComponentClass => {
        ReactNative.AppRegistry.registerComponent(
            'AppMainComponent', () => ComponentClass);
    },

    Adapter = Object.freeze({
        name: 'react',
        api: { React, ReactNative }
    });

export {
    createElement,
    defineComponent,
    isElement,
    mount,
    Adapter,
    Config
};
