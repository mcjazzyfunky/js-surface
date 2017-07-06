import adaptReactLikeRenderEngine from './internal/adaption/adaptReactLikeRenderEngine.js';

import Preact from 'preact';

const VNode = Preact.h('').constructor;

const {
    createElement,
    defineClassComponent,
    defineFunctionalComponent,
    defineStandardComponent,
    isElement,
    isRenderable,
    render,
    Component,
    RenderEngine
} = adaptReactLikeRenderEngine({
    renderEngineName: 'preact',
    renderEngineAPI: Preact,
    Component: Preact.Component,
    createElement: preactCreateElement,
    createFactory: preactCreateFactory,
    isValidElement: preactIsValidElement,
    render: preactRender
});

export {
    createElement,
    defineClassComponent,
    defineFunctionalComponent,
    defineStandardComponent,
    isElement,
    isRenderable,
    render,
    Component,
    RenderEngine
};

function preactCreateFactory(type) {
    return createElement.bind(null, type);
}

function preactIsValidElement(it) {
    return it !== undefined && it !== null
        && (typeof it !== 'object'|| it instanceof VNode);
}

function preactRender(content, targetNode) {
    if (!isElement(content)) {
        throw new TypeError(
            "[render] First argument 'content' has to be a valid element");
    }

    if (typeof targetNode === 'string') {
        targetNode = document.getElementById(targetNode);
    }

    return Preact.render(content, targetNode);
}

function preactCreateElement(tag, props, ...children)  {
    // TODO: For performance reasons
    if (tag === null || tag === undefined || typeof tag !== 'string' && !preactIsValidElement(tag)) {
        throw new TypeError(
            '[createElement] '
            + "First argument 'tag' must not be undefined or null");
    }

    let ret;

    if (!children) {
        ret = preactCreateElement.apply(null, arguments);
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
