import Surface from '../dio/dio.js';

const
    module = { ...Surface },
    createContext = Surface.createContext,
    createElement = Surface.createElement,
    createPortal = Surface.createPortal,
    defineComponent = Surface.defineComponent,
    isElement = Surface.isElement,
    mount = Surface.mount,
    Fragment = Surface.Fragment,

    Adapter = Object.freeze({
        name: 'surface',
        api: Object.freeze({ Surface: module })
    });

module.Adapter = Adapter;

Object.freeze(module);

export default module;

export {
    createContext,
    createElement,
    createPortal,
    defineComponent,
    isElement,
    mount,
    Adapter,
    Fragment
};

/* --- if React shall be used instead of DIO ---
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
        
        extras: {
            createPortal: ReactDOM.createPortal,
            mount: customMount,
            Fragment: React.Fragment
        }
    }),

    createContext = Surface.createContext,
    createElement = Surface.createElement,
    createPortal = Surface.createPortal,
    defineComponent = Surface.defineComponent,
    isElement = Surface.isElement,
    mount = Surface.mount,
    Adapter = Surface.Adapter,
    Fragment = Surface.Fragment;

export default Surface;

export {
    createContext,
    createElement,
    createPortal,
    defineComponent,
    isElement,
    mount,
    Adapter,
    Fragment
};
*/