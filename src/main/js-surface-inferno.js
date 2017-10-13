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
    mount,
    unmount,
    RenderEngine
} = adaptReactLikeRenderEngine({
    renderEngineName: 'inferno',
    renderEngineAPI:  { Inferno },
    Component: Inferno.Component,
    createElement: customCreateElement,
    createFactory: customCreateFactory,
    isValidElement: customIsValidElement,
    mount: customMount
});

export {
    createElement,
    defineClassComponent,
    defineFunctionalComponent,
    defineStandardComponent,
    isElement,
    isRenderable,
    mount,
    unmount,
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

function customMount(content, targetNode) {
    Inferno.render(Inferno.render(content, targetNode));

    return () => Inferno.render(null, targetNode);
}
