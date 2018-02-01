import adaptReactLikeExports
    from '../../adaption/specific/adaptReactLikeExports';

import adaptCreatePreactElement
    from '../../adaption/specific/adaptCreatePreactElement';

import Preact from 'preact';

const { render } = Preact;

const
    Surface = {}, // will be filled later
    VNode = Preact.h('').constructor,
    createPreactElement = adaptCreatePreactElement({});

const {
    createElement,
    defineComponent,
    inspectElement,
    isElement,
    mount,
    Adapter
} = adaptReactLikeExports({
    createElement: createPreactElement,
    isValidElement: it => it instanceof VNode,
    Fragment: 'x-fragment', // TODO
    Component: Preact.Component,
    render: Preact.render,
    unmountComponentAtNode: targetNode => render('', targetNode),
    adapterName: 'surface',
    adapterAPI: Object.freeze({ Surface })
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
