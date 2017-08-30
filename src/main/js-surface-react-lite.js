import adaptReactLikeRenderEngine from './internal/adaption/adaptReactLikeRenderEngine.js';

import ReactLite from 'react-lite';

const {
    defineComponent,
    createElement,
    isElement,
    isRenderable,
    render,
    RenderEngine
} = adaptReactLikeRenderEngine({
    renderEngineName: 'react-lite',
    renderEngineAPI: ReactLite,
    Component: ReactLite.Component,
    createElement: reactLiteCreateElement,
    createFactory: ReactLite.createFactory,
    isValidElement: ReactLite.isValidElement,
    render: reactLiteRender
});

export {
    defineComponent,
    createElement,
    isElement,
    isRenderable,
    render,
    RenderEngine
};

function reactLiteRender(content, targetNode) {
    if (!isElement(content)) {
        throw new TypeError(
            "[render] First argument 'content' has to be a valid element");
    }

    const target = typeof targetNode === 'string'
        ? document.getElementById(targetNode)
        : targetNode;

    return ReactLite.render(content, target);
}

function reactLiteCreateElement(tag, props, ...children)  {
    // TODO: For performance reasons
    if (tag === null || tag === undefined  || typeof tag !== 'string'  && !ReactLite.isValidElement(tag)) {
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
