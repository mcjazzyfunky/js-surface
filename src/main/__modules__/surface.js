import React from 'react';
import ReactDOM from 'react-dom';
import adaptMountFunction from '../adaption/adaptMountFunction';
import buildSurfaceModuleForReact from './internal/buildSurfaceModuleForReact';

const
    customMount = adaptMountFunction({
        mountFunction: ReactDOM.render,
        unmountFunction: ReactDOM.unmountComponentAtNode,
        isElement: React.isValidElement
    }),

    Surface = buildSurfaceModuleForReact({
        adpaterName: 'surface',
        api: { ReactDOM },
        mount: customMount
    }),

    createElement = Surface.createElement,
    defineComponent = Surface.defineComponent,
    isElement = Surface.isElement,
    mount = Surface.mount,
    Adapter = Surface.Adapter,
    fragment = Surface.fragment,
    Fragment = Surface.Fragement;

export default Surface;

export {
    createElement,
    defineComponent,
    isElement,
    mount,
    Adapter,
    fragment,
    Fragment
};
