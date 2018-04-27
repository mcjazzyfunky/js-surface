import adaptReactLikeRenderEngine from './adaption/adaptReactLikeRenderEngine';

import Preact from 'preact';

const VNode = Preact.h('').constructor;

const {
    createElement,
    defineComponent,
    defineClassComponent,
    defineFunctionalComponent,
    defineStandardComponent,
    hyperscript,
    isElement,
    isRenderable,
    mount,
    unmount,
    Adapter,
    Config
} = adaptReactLikeRenderEngine({
    renderEngineName: 'preact',
    renderEngineAPI: Preact,
    Component: Preact.Component,
    createElement: Preact.createElement,
    createFactory: preactCreateFactory,
    isValidElement: preactIsValidElement,
    mount: preactMount
});

export {
    createElement,
    defineComponent,
    defineClassComponent,
    defineFunctionalComponent,
    defineStandardComponent,
    hyperscript,
    isElement,
    isRenderable,
    mount,
    unmount,
    Adapter,
    Config
};

function preactCreateFactory(type) {
    return createElement.bind(null, type);
}

function preactIsValidElement(it) {
    return it !== undefined && it !== null
        && (typeof it !== 'object'|| it instanceof VNode);
}

function preactMount(content, targetNode) {
    Preact.render(content, targetNode);

    return () => Preact.render('', targetNode);
}
