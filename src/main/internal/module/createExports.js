import defineClassComponent from '../../api/defineClassComponent.js';
import defineDispatchComponent from '../../api/defineDispatchComponent.js';
import hyperscript from '../../api/hyperscript.js';
import Component from '../../api/Component.js';
import Spec from '../../api/Spec.js';

export default function createModule(config) {
    const ret = {
        createElement: config.createElement,
        defineClassComponent,
        defineDispatchComponent,
        defineFunctionalComponent: config.defineFunctionalComponent,
        defineStandardComponent: config.defineStandardComponent,
        hyperscript,
        isElement: config.isElement,
        render: config.render,
        Component,
        Spec
    };

    return ret;
}
