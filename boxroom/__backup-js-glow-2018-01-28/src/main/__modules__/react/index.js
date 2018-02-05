import adaptReactExports from '../../adaption/adaptReactExports';
import React from 'react';
import ReactDOM from 'react-dom';

const Surface = {}; // will be filled later

const {
    createElement,
    defineComponent,
    inspectElement,
    isElement,
    isFactory,
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
Surface.isFactory = isFactory;
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
    isFactory,
    mount,
    unmount,
    Adapter
};
