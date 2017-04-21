import createExports from './internal/module/createExports.js';
import defineDependentFunctions from './internal/react/defineDependentFunctions.js';

import React from 'react';
import ReactDOM from 'react-dom';

const moduleConfig = defineDependentFunctions({
    Component: React.Component,
    createElement: createElement,
    createFactory: React.createFactory,
    isValidElement: React.isValidElement
});
alert(1)
moduleConfig.createElement = React.createElement;

moduleConfig.render = (content, targetNode) => {
    if (!isElement(content)) {
        throw new TypeError(
            "[render] First argument 'content' has to be a valid element");
    }

    if (typeof targetNode === 'string') {
        targetNode = document.getElementById(targetNode);
    }

    return ReactDOM.render(content, targetNode);
};

const {
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
} = createExports(moduleConfig);


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
