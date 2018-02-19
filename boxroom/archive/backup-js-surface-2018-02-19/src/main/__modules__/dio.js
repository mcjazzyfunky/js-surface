import adaptReactLikeExports
    from '../adaption/specific/adaptReactLikeExports';

import adaptCreateReactElement
    from '../adaption/specific/adaptCreateDioElement';

import Dio from 'dio.js';

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
    isValidElement: Dio.isValidElement,
    Fragment: Dio.Fragment,
    Component: Dio.Component,
    render: Dio.render,
    unmountComponentAtNode: Dio.unmountComponentAtNode,
    adapterName: 'dio',
    adapterAPI: { Dio, Surface },
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
