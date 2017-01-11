import defineDependentFunctions from './internal/react/defineDependentFunctions.js';
import defineStandardComponent from './api/defineStandardComponent.js';
import defineAdvancedComponent from './api/defineAdvancedComponent.js';
import hyperscript from './api/hyperscript.js';
import Component from './api/Component.js';
import Constraints from './api/Constraints.js';

import React from 'react';
import AppRegistry from 'react-native';

const {
	defineBasicComponent,
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
	defineAdvancedComponent,
	defineStandardComponent,
	defineFunctionalComponent,
	defineBasicComponent,
	isElement,
	render,
	Component,
	Constraints
};

const createElement = React.createElement;

function render(Component) {
	AppRegistry.registerComponent('AppMainComponent', () => Component);
}
