import adaptReactLikeComponentSystem from './adaption/adaptReactLikeComponentSystem';

import Preact from 'preact';

const VNode = Preact.h('').constructor;

const {
    createElement,
    defineComponent,
    isElement,
    mount,
    unmount,
    Adapter,
    Config
} = adaptReactLikeComponentSystem({
    name: 'preact',
    api: { Preact },
    Component: Preact.Component,
    createElement: Preact.createElement,
    createFactory: preactCreateFactory,
    isValidElement: preactIsValidElement,
    mount: preactMount,
    browserBased: true
});

export {
    createElement,
    defineComponent,
    isElement,
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
