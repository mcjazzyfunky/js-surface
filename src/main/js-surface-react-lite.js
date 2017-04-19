import defineDependentFunctions from './internal/react/defineDependentFunctions.js';
import defineStandardComponent from './api/defineStandardComponent.js';
import defineAdvancedComponent from './api/defineAdvancedComponent.js';
import hyperscript from './api/hyperscript.js';
import Component from './api/Component.js';
import Spec from './api/Spec.js';

import ReactLite from 'react-lite';

const {
    defineBasicComponent,
    defineFunctionalComponent,
    isElement
} = defineDependentFunctions({
    Component: ReactLite.Component,
    createElement: createElement,
    createFactory: ReactLite.createFactory,
    isValidElement: ReactLite.isValidElement
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

function render(content, targetNode) {
    if (!isElement(content)) {
        throw new TypeError(
            "[render] First argument 'content' has to be a valid element");
    }

    const target = typeof targetNode === 'string'
        ? document.getElementById(targetNode)
        : targetNode;

    return ReactLite.render(content, target);
}

function createElement(tag, props, ...children)  {
    // TODO: For performance reasons
    if (tag === null || tag === undefined || typeof tag !== 'string' && !ReactLite.isValidElement(tag)) {
        throw new TypeError(
            '[createElement] '
            + "First argument 'tag' must not be undefined or null");
    }

    let ret;

    if (!children) {
        ret = createElement.apply(null, arguments);
    } else {
        const newArguments = [tag, props];

        for (let child of children) {
            if (child && !Array.isArray(child) && typeof child[Symbol.iterator] === 'function') {
                newArguments.push(Array.from(child));
            } else {
                newArguments.push(child);
            }
        }

        ret = ReactLite.createElement.apply(null, newArguments);
    }

    return ret;
}
