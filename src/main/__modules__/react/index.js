import adaptReactExports from '../../adaption/preact-react/adaptExports';
import React from 'react';
import ReactDOM from 'react-dom';

const Surface = {}; // will be filled later

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
    unmount,
    Adapter
};
