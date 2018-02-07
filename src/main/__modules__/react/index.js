import adaptReactLikeExports
    from '../../adaption/specific/adaptReactLikeExports';

import adaptCreateReactElement
    from '../../adaption/specific/adaptCreateReactElement';

import React from 'react';
import ReactDOM from 'react-dom';

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
    Fragment,
    Html,
    Svg
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
