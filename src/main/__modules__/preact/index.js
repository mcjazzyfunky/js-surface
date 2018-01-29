import adaptReactExports from '../../adaption/specific/adaptPreactReactExports';
import createPreactElement from '../../adaption/specific/createPreactElement';

import Preact from 'preact';

const { render } = Preact;

const
    Surface = {}, // will be filled later
    VNode = Preact.h('').constructor,

    React = {
        isValidElement: it => it instanceof VNode,
        Component: Preact.Component,
        
        createElement: createPreactElement,

        // TODO - Wait for a newer version of Preact that hopefully
        // will have some kind of fragment support.
        Fragment: 'x-fragment' // Not really working in all cases - but what shall we do?!
    },

    ReactDOM = {
        render,
        unmountComponentAtNode: targetNode => render('', targetNode)
    };

const {
    createElement,
    defineComponent,
    inspectElement,
    isElement,
    mount,
    Adapter
} = adaptReactExports({
    React,
    ReactDOM,
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
