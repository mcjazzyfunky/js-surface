import Preact from 'preact';

import adaptReactExports from '../adaption/react/adaptReactExports';
import adaptDomMountFunction from '../adaption/adaptDomMountFunction';
import adaptHtmlBuilders from '../adaption/adaptHtmlBuilders';
import adaptSvgBuilders from '../adaption/adaptSvgBuilders';

import {} from '../polyfill/polyfill';

const 
    VNode = Preact.h('').constructor,
    isPreactElement = it => it instanceof VNode,
    createPreactElement = Preact.h;

const {
    // core
    createElement,
    defineComponent,
    hyperscript,
    inspectElement,
    isElement,
    mount,
    Adapter,

    // add-ons
    Html,
    Svg
} = adaptReactExports({
    createElement: createPreactElement,
    isElement: isPreactElement,
    adapterName: 'preact',
    adapterApi: { Preact },
    Component: Preact.Component,
    Fragment: 'x-fragment', // TODO

    mount: adaptDomMountFunction({
        mount: (content, node) => {
            if (node.___preactRoot) {
                Preact.render('', node, node.___preactRoot);
            }

            node.___preactRoot = Preact.render(content, node);
        },

        unmount: node => Preact.render('', node, node.___preactRoot),
        isElement: isPreactElement
    }),

    extras: {
        Html: adaptHtmlBuilders({ createElement: createPreactElement }),
        Svg: adaptSvgBuilders({ createElement: createPreactElement })
    }
});

export default Object.freeze({
    createElement,
    defineComponent,
    hyperscript,
    inspectElement,
    isElement,
    mount,
    Adapter,
    Html,
    Svg
});

export {
    // core
    createElement,
    defineComponent,
    hyperscript,
    inspectElement,
    isElement,
    mount,
    Adapter,

    // add-ons
    Html,
    Svg
};
