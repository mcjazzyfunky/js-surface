import adaptSurfaceExports from './adaption/adaptSurfaceExports';

import Surface from 'js-surface';

let exports;

const {
    component,
    createElement,
    inspectElement,
    isElement,
    mount,
    unmount,
    Adapter,
    Component,
    HtmlBuilders
} = exports = adaptSurfaceExports({
    Surface,
    adpaterName: 'surface',
    adapterAPI: { Surface }
});

export default exports;

export {
    component,
    createElement,
    inspectElement,
    isElement,
    mount,
    unmount,
    Adapter,
    Component,
    HtmlBuilders
};
