import adaptReactLikeRenderEngine from './adaption/adaptReactLikeRenderEngine';

import ReactLite from 'react-lite';

const {
    createElement,
    defineClassComponent,
    defineFunctionalComponent,
    defineStandardComponent,
    isElement,
    isRenderable,
    render,
    RenderEngine
} = adaptReactLikeRenderEngine({
    renderEngineName: 'react-lite',
    renderEngineAPI: ReactLite,
    Component: ReactLite.Component,
    createElement: reactLiteCreateElement,
    createFactory: ReactLite.createFactory,
    isValidElement: ReactLite.isValidElement,
    render: reactLiteRender
});

export {
    createElement,
    defineClassComponent,
    defineFunctionalComponent,
    defineStandardComponent,
    isElement,
    isRenderable,
    render,
    RenderEngine
};

function reactLiteRender(content, targetNode) {
    if (!isElement(content)) {
        throw new TypeError(
            "[render] First argument 'content' has to be a valid element");
    }

    const target = typeof targetNode === 'string'
        ? document.getElementById(targetNode)
        : targetNode;

    if (target) {
        target.innerHTML = '<span></span>';
        
        const container = target.firstChild;

        var cleanedUp = false;
        
        const cleanUp = event => {
            if (!cleanedUp && (!event || event.target === container)) {
                cleanedUp = true;
                container.removeEventListener('DOMNodeRemovedFromDocument', cleanUp);  
                ReactLite.unmountComponentAtNode(container);
                container.innerHTML = '';
            }
        };

        container.addEventListener('DOMNodeRemovedFromDocument', cleanUp);  
        ReactLite.render(content, container);

        return { dispose: () => cleanUp() };
    }
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
