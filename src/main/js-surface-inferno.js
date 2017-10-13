import adaptReactLikeRenderEngine from './adaption/adaptReactLikeRenderEngine';

import InfernoCore from 'inferno';
import createInfernoElement from 'inferno-create-element';
import InfernoComponent from 'inferno-component';

const Inferno = Object.assign({}, InfernoCore, {
    createElement: createInfernoElement,
    Component: InfernoComponent    
});

// Get rid of internal functions
for (const key of Object.keys(Inferno)) {
    if (key.startsWith('internal')) {
        delete Inferno[key];
    }
}

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
    renderEngineName: 'inferno',
    renderEngineAPI:  { Inferno },
    Component: Inferno.Component,
    createElement: customCreateElement,
    createFactory: customCreateFactory,
    isValidElement: customIsValidElement,
    render: customRender
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

// ------------------------------------------------------------------

function customCreateElement(tag, props, ...children)  {
    // TODO: For performance reasons
    if (tag === null || tag === undefined || typeof tag !== 'string' && !customIsValidElement(tag)) {
        throw new TypeError(
            '[createElement] '
            + "First argument 'tag' must not be undefined or null");
    }

    let ret;

    if (!children) {
        ret = customCreateElement.apply(null, arguments);
    } else {
        const newArguments = [tag, props];

        for (let child of children) {
            if (child && !Array.isArray(child) && typeof child[Symbol.iterator] === 'function') {
                newArguments.push(Array.from(child));
            } else {
                newArguments.push(child);
            }
        }

        ret = Inferno.createElement.apply(null, newArguments);
    }

    return ret;
}

function customCreateFactory(type) {
    return createElement.bind(null, type);
}

function customIsValidElement(it) {
    return it !== undefined && it !== null
        && (typeof it !== 'object' || !!(it.flags & (28 | 3970))); // 28: component, 3970: element
}

function customRender(content, targetNode) {
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
                container.removeEventListener('DOMNodeRemoved', cleanUp);
                Inferno.render(null, container);
                container.innerHTML = '';
            }
        };

        container.addEventListener('DOMNodeRemovedFromDocument', cleanUp, false);  
        Inferno.render(content, container);

        return { dispose: () => cleanUp() };
    }
}
