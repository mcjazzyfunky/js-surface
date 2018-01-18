import adaptComponentClass from './adapt/adaptComponentClass';
import adaptReactifiedDefineComponent from './adapt/adaptReactifiedDefineComponent';
import Config from './config/Config';
import ElementInspector from './helper/ElementInspector';

import React from 'react';
import ReactNative from 'react-native';

const
    defineComponent = adaptReactifiedDefineComponent({
        createElement: React.createElement,
        ComponentClass: React.Component
    }),

    createElement = (...args) => {
        const type = args[0];

        if (type && type.isComponentFactory) {
            args[0] = type.type;
        }

        return React.createElement.apply(null, args);
    },

    isElement = React.isValidElement,

    mount = ComponentClass => {
        ReactNative.AppRegistry.registerComponent(
            'AppMainComponent', () => ComponentClass);
    },

    Adapter = Object.freeze({
        name: 'react',
        api: { React, ReactNative }
    }),
    
    inspectElement = obj => {
        let ret = null;

        if (React.isElement(obj)) {
            ret = new ElementInspector(obj.type, obj.props);
        }

        return ret;
    },
    
    Component = adaptComponentClass(defineComponent);

export {
    createElement,
    defineComponent,
    inspectElement,
    isElement,
    mount,
    Adapter,
    Component,
    Config
};
