import adaptReactLikeComponentSystem from './adaption/adaptReactLikeComponentSystem';

import ReactLite from 'react-lite';

const {
    createElement,
    defineComponent,
    isElement,
    mount,
    unmount,
    Adapter,
    Config
} = adaptReactLikeComponentSystem({
    name: 'react-lite',
    api: ReactLite,
    Component: ReactLite.Component,
    createElement: ReactLite.createElement,
    createFactory: ReactLite.createFactory,
    isValidElement: ReactLite.isValidElement,
    mount: reactLiteMount,
    browserBased: true
});

export {
    createElement,
    defineComponent,
    isElement,
    mount,
    unmount,
    Adapter,
    Config
};

function reactLiteMount(content, targetNode) {
    ReactLite.render(content, targetNode);
    
    return () => ReactLite.unmountComponentAtNode(targetNode);
}
