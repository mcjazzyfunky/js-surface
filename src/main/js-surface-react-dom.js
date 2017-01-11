import defineDependentFunctions from './internal/react/defineDependentFunctions.js';
import defineStandardComponent from './api/defineStandardComponent.js';
import defineAdvancedComponent from './api/defineAdvancedComponent.js';
import hyperscript from './api/hyperscript.js';
import Component from './api/Component.js';
import Spec from './api/Spec.js';

import React from 'react';
import ReactDOM from 'react-dom';

const {
	defineBasicComponent,
	defineFunctionalComponent,
	isElement
} = defineDependentFunctions({
	Component: React.Component,
	createElement: createElement,
	createFactory: React.createFactory,
	isValidElement: React.isValidElement
});

export {
	createElement,
	defineAdvancedComponent,
	defineStandardComponent,
	defineFunctionalComponent,
	defineBasicComponent,
	hyperscript,
	isElement,
	render,
	Component,
	Spec,
};

const createElement = React.createElement;

function render(content, targetNode) {
    if (!isElement(content)) {
        throw new TypeError(
            "[render] First argument 'content' has to be a valid element");
    }

    if (typeof targetNode === 'string') {
        targetNode = document.getElementById(targetNode);
    }

    return ReactDOM.render(content, targetNode);
}
