import defineDependentFunctions from './internal/react/defineDependentFunctions.js';
import defineClassComponent from './api/defineClassComponent.js';
import defineDispatchComponent from './api/defineDispatchComponent.js';
import hyperscript from './api/hyperscript.js';
import Component from './api/Component.js';
import Spec from './api/Spec.js';

import React from 'react';
import AppRegistry from 'react-native';

const {
    defineStandardComponent,
    defineFunctionalComponent,
    isElement
} = defineDependentFunctions({
    Component: React.Component,
    createElement: React.createElement,
    createFactory: React.createFactory,
    isValidElement: React.isValidElement
});

export {
    createElement,
    defineDispatchComponent,
    defineClassComponent,
    defineFunctionalComponent,
    defineStandardComponent,
    isElement,
    render,
    Component,
    Spec
};

const createElement = React.createElement;

function render(Component) {
    AppRegistry.registerComponent('AppMainComponent', () => Component);
}
