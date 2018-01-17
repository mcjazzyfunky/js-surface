import adaptComponentClass from './adapt/adaptComponentClass';
import adaptReactifiedDefineComponent from './adapt/adaptReactifiedDefineComponent';
import Config from './config/Config';
import ElementWrapper from './helper/ElementWrapper';

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
    }),
    
    element = obj => {
        let ret = null;

        if (React.isElement(obj)) {
            ret = new ElementWrapper(obj.type, obj.props);
        }

        return ret;
    },
    
    Component = adaptComponentClass(defineComponent);

export {
    createElement,
    defineComponent,
    element,
    isElement,
    mount,
    Adapter,
    Component,
    Config
};
