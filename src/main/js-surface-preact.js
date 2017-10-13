import adaptReactLikeRenderEngine from './adaption/adaptReactLikeRenderEngine';

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

    const target = typeof targetNode === 'string'
        ? document.getElementById(targetNode)
        : targetNode;

    if (target) {
        target.innerHTML = '<span></span>';

        const container = target.firstChild;

        var cleanedUp = false;
        
        const cleanUp = event => {
            if (!cleanedUp && (!event || event.target === container)) {
                cleanedUp = true;
                container.removeEventListener('DOMNodeRemovedFromDocument', cleanUp);  
                Preact.render('', container);
                container.innerHTML = '';
            }
        };

        container.addEventListener('DOMNodeRemovedFromDocument', cleanUp);  
        Preact.render(content, container);

        return { dispose: () => cleanUp() };
    }
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
