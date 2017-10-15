import adaptReactLikeRenderEngine from './adaption/adaptReactLikeRenderEngine';

import ReactLite from 'react-lite';

const {
    createElement,
    defineClassComponent,
    defineFunctionalComponent,
    defineStandardComponent,
    hyperscript,
    isElement,
    isRenderable,
    mount,
    unmount,
    ComponentSystem 
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
    defineClassComponent,
    defineFunctionalComponent,
    defineStandardComponent,
    hyperscript,
    isElement,
    isRenderable,
    mount,
    unmount,
    ComponentSystem 
};

function reactLiteMount(content, targetNode) {
    ReactLite.render(content, targetNode);
    
    return () => ReactLite.unmountComponentAtNode(targetNode);
}
