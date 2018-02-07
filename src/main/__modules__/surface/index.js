import adaptReactLikeExports
    from '../../adaption/specific/adaptReactLikeExports';

import adaptCreatePreactElement
    from '../../adaption/specific/adaptCreatePreactElement';


import Preact from 'preact';

const { render } = Preact;

const
    Surface = {}, // will be filled later
    VNode = Preact.h('').constructor;

const {
    // core
    createElement,
    defineComponent,
    inspectElement,
    isElement,
    mount,
    Adapter,

    // addons
    fragment,
    Fragment,
    Html,
    Svg
} = adaptReactLikeExports({
    createElement: adaptCreatePreactElement({}),
    isValidElement: it => it instanceof VNode,
    Fragment: 'x-fragment', // TODO
    Component: Preact.Component,
    render: Preact.render,
    unmountComponentAtNode: targetNode => render('', targetNode),
    adapterName: 'surface',
    adapterAPI: { Surface },
});

// core
Surface.createElement = createElement;
Surface.defineComponent = defineComponent;
Surface.inspectElement = inspectElement;
Surface.isElement = isElement;
Surface.mount = mount;
Surface.Adapter = Adapter;

// addons
Surface.fragment = fragment;
Surface.Fragment = Fragment;
Surface.Html = Html;
Surface.Svg = Svg;

Object.freeze(Surface);

export default Surface;

export {
    // core
    createElement,
    defineComponent,
    inspectElement,
    isElement,
    mount,
    Adapter,

    // addons
    fragment,
    Fragment,
    Html,
    Svg
};
