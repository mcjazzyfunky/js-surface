import adaptReactLikeExports
    from '../../adaption/specific/adaptReactLikeExports';

import adaptCreateReactElement
    from '../../adaption/specific/adaptCreateReactElement';

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
} = adaptReactLikeExports({
    createElement: adaptCreateReactElement({}),
    isValidElement: React.isValidElement,
    Fragment: React.Fragment,
    Component: React.Component,
    render: ReactDOM.render,
    unmountComponentAtNode: ReactDOM.unmountComponentAtNode,
    adapterName: 'react',
    adapterAPI: { React, ReactDOM, Surface },
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
