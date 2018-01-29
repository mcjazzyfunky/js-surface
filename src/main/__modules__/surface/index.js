
import adaptReactExports from '../../adaption/specific/adaptPreactReactExports';
import convertIterablesToArrays from '../../util/convertIterablesToArrays';

import Preact from 'preact';

const { h, render } = Preact;

const
    Surface = {}, // will be filled later
    VNode = h('').constructor,

    React = {
        isValidElement: it => it instanceof VNode,
        Component: Preact.Component,
        
        createElement: (...args) =>
            h.apply(null, convertIterablesToArrays(args)),

        // TODO - Wait for a newer version of Preact that hopefully
        // will have some kind of fragment support.
        Fragment: 'x-fragment' // Not really working in all cases - but what shall we do?
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
    unmount,
    Adapter
} = adaptReactExports({
    React,
    ReactDOM,
    adapterName: 'surface',
    adapterAPI: Object.freeze({ Surface })
});

Surface.createElement = createElement;
Surface.defineComponent = defineComponent;
Surface.inspectElement = inspectElement;
Surface.isElement = isElement;
Surface.mount = mount;
Surface.unmount = unmount;
Surface.Adapter = Adapter;

Object.freeze(Surface);

export default Surface;

export {
    createElement,
    defineComponent,
    inspectElement,
    isElement,
    mount,
    unmount,
    Adapter
};
