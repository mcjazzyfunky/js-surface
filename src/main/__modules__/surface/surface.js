import React from 'react';
import ReactDOM from 'react-dom';
import adaptMountFunction from '../../adaption/adaptMountFunction';
import buildSurfaceModuleForReact from '../react/internal/buildSurfaceModuleForReact';

const
    customMount = adaptMountFunction({
        mountFunction: ReactDOM.render,
        unmountFunction: ReactDOM.unmountComponentAtNode,
        isElement: React.isValidElement
    }),

    Surface = buildSurfaceModuleForReact({
        adapterName: 'surface',
        mount: customMount
    }),

    createContext = Surface.createContext,
    createElement = Surface.createElement,
    defineComponent = Surface.defineComponent,
    isElement = Surface.isElement,
    mount = Surface.mount,
    Adapter = Surface.Adapter,
    fragment = Surface.fragment,
    Fragment = Surface.Fragement;

export default Surface;

export {
    createContext,
    createElement,
    defineComponent,
    isElement,
    mount,
    Adapter,
    fragment,
    Fragment
};
