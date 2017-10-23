import adaptReactLikeRenderEngine from './adaption/adaptReactLikeRenderEngine';

import ReactLite from 'react-lite';

const {
    createElement,
    defineComponent,
    isElement,
    mount,
    unmount,
    Adapter,
    Config
} = adaptReactLikeRenderEngine({
    renderEngineName: 'react-lite',
    renderEngineAPI: ReactLite,
    Component: ReactLite.Component,
    createElement: ReactLite.createElement,
    createFactory: ReactLite.createFactory,
    isValidElement: ReactLite.isValidElement,
    mount: reactLiteMount
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
