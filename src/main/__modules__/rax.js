import adaptReactLikeExports
    from '../adaption/specific/adaptReactLikeExports';

import adaptCreateReactElement
    from '../adaption/specific/adaptCreateReactElement';

import Rax from 'rax';

const Surface = {}; // will be filled later

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
    Fragment
} = adaptReactLikeExports({
    createElement: adaptCreateReactElement({}),
    isValidElement: Rax.isValidElement,
    Fragment: 'x-fragment', // TODO
    Component: Rax.Component,
    render: Rax.render,
    unmountComponentAtNode: Rax.unmountComponentAtNode,
    adapterName: 'react',
    adapterAPI: { Rax, Surface },
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
    Fragment
};
