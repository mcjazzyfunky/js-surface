import defineDependentFunctions from './internal/react/defineDependentFunctions.js';
import defineClassComponent from './api/defineClassComponent.js';
import defineDispatchComponent from './api/defineDispatchComponent.js';
import hyperscript from './api/hyperscript.js';
import Component from './api/Component.js';
import Spec from './api/Spec.js';

import React from 'react';
import ReactDOM from 'react-dom';

const {
    defineStandardComponent,
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
    defineDispatchComponent,
    defineClassComponent,
    defineFunctionalComponent,
    defineStandardComponent,
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
