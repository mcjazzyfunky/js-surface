import adaptReactExports from '../../adaption/specific/adaptPreactReactExports';
import React from 'react';
import ReactDOM from 'react-dom';

const Surface = {}; // will be filled later

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
    adapterName: 'react',
    adapterAPI: { React, ReactDOM, Surface },
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
    Adapter
};
