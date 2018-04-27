import React from 'react';
import ReactDOM from 'react-dom';

import adaptReactExports from '../adaption/react/adaptReactExports';
import createElement from 'js-hyperscript/react';
import adaptDomMountFunction from '../adaption/adaptDomMountFunction';

import {} from '../polyfill/polyfill';

const {
    defineComponent,
    inspectElement,
    isElement,
    mount,
    Adapter,
} = adaptReactExports({
    createElement: React.createElement,
    isElement: React.isValidElement,
    adapterName: 'react',
    adapterApi: { React, ReactDOM },
    Component: React.Component,
    Fragment: React.Fragment,

    mount: adaptDomMountFunction({
        mount: ReactDOM.render,
        unmount: ReactDOM.unmountComponentAtNode,
        isElement: React.isValidElement
    })
});

export default Object.freeze({
    createElement,
    defineComponent,
    inspectElement,
    isElement,
    mount,
    Adapter
});

export {
    createElement,
    defineComponent,
    inspectElement,
    isElement,
    mount,
    Adapter,
};
