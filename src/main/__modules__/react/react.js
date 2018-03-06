import React from 'react';
import ReactDOM from 'react-dom';
import adaptMountFunction from '../../adaption/adaptMountFunction';
import buildSurfaceModuleForReact from './internal/buildSurfaceModuleForReact';

const
    customMount = adaptMountFunction({
        mountFunction: ReactDOM.render,
        unmountFunction: ReactDOM.unmountComponentAtNode,
        isElement: React.isValidElement
    }),

    Surface = buildSurfaceModuleForReact({
        adapterName: 'react',
        api: { React, ReactDOM },
        
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
