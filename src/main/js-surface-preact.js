import defineDependentFunctions from './internal/react/defineDependentFunctions.js';
import defineClassComponent from './api/defineClassComponent.js';
import defineDispatchComponent from './api/defineDispatchComponent.js';
import hyperscript from './api/hyperscript.js';
import Component from './api/Component.js';
import Spec from './api/Spec.js';

import Preact from 'preact';

const
     VNode = Preact.h('').constructor,

    {    defineFunctionalComponent,
        defineStandardComponent,
        isElement
    } = defineDependentFunctions({
        Component: Preact.Component,
        createElement,
        createFactory,
        isValidElement
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
    Spec
};

function createFactory(type) {
    return createElement.bind(null, type);
}

function isValidElement(it) {
    return it !== undefined && it !== null
        && (typeof it !== 'object'|| it instanceof VNode);
}

function render(content, targetNode) {
    if (!isElement(content)) {
        throw new TypeError(
            "[render] First argument 'content' has to be a valid element");
    }

    if (typeof targetNode === 'string') {
        targetNode = document.getElementById(targetNode);
    }

    return Preact.render(content, targetNode);
}

function createElement(tag, props, ...children)  {
    // TODO: For performance reasons
    if (tag === null || tag === undefined || typeof tag !== 'string' && !isValidElement(tag)) {
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

        ret = Preact.h.apply(null, newArguments);
    }

    return ret;
}