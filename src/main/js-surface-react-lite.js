import adaptReactLikeRenderEngine from './adaption/adaptReactLikeRenderEngine';

import ReactLite from 'react-lite';

const {
    createElement,
    defineClassComponent,
    defineFunctionalComponent,
    defineStandardComponent,
    isElement,
    isRenderable,
    mount,
    unmount,
    ComponentSystem 
} = adaptReactLikeRenderEngine({
    renderEngineName: 'react-lite',
    renderEngineAPI: ReactLite,
    Component: ReactLite.Component,
    createElement: reactLiteCreateElement,
    createFactory: ReactLite.createFactory,
    isValidElement: ReactLite.isValidElement,
    mount: reactLiteMount
});

export {
    createElement,
    defineClassComponent,
    defineFunctionalComponent,
    defineStandardComponent,
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

function reactLiteCreateElement(tag, props, ...children)  {
    // TODO: For performance reasons
    if (tag === null || tag === undefined  || typeof tag !== 'string'  && !ReactLite.isValidElement(tag)) {
        throw new TypeError(
            '[createElement] '
            + "First argument 'tag' must not be undefined or null");
    }

    let ret;

    if (!children) {
        ret = createElement.apply(null, arguments);
    } else {
        let adjustedProps = props;

        if (props && typeof tag === 'string') {
            if (props.class) {
                adjustedProps = Object.assign({}, props);
                adjustedProps.className = props.class;
                delete adjustedProps.class;
            } else if (props.className) {
                adjustedProps = Object.assign({}, props);
                delete adjustedProps.className;
            }
        }

        const newArguments = [tag, adjustedProps];

        for (let child of children) {
            if (child && !Array.isArray(child) && typeof child[Symbol.iterator] === 'function') {
                newArguments.push(Array.from(child));
            } else {
                newArguments.push(child);
            }
        }

        ret = ReactLite.createElement.apply(null, newArguments);
    }

    return ret;
}
