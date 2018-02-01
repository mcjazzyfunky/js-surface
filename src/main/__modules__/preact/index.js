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
    createElement,
    defineComponent,
    inspectElement,
    isElement,
    mount,
    Adapter
} = adaptReactLikeExports({
    createElement: adaptCreatePreactElement({}),
    isValidElement: it => it instanceof VNode,
    Fragment: 'x-fragment', // TODO
    Component: Preact.Component,
    render: Preact.render,
    unmountComponentAtNode: targetNode => render('', targetNode),
    adapterName: 'preact',
    adapterAPI: Object.freeze({ Preact, Surface })
});

Surface.createElement = createElement;
Surface.defineComponent = defineComponent;
Surface.inspectElement = inspectElement;
Surface.isElement = isElement;
Surface.mount = mount;
Surface.Adapter = Adapter;

Object.freeze(Surface);

export default Surface;

export {
    createElement,
    defineComponent,
    inspectElement,
    isElement,
    mount,
    Adapter
};
