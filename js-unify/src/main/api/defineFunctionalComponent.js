import determineComponentMeta from 
    '../internal/helper/determineComponentMeta';

import { defineFunctionalComponent as defineComponent } from 'js-surface';

export default function defineFunctionalComponent(renderFunction, meta = null) {
    if (typeof renderFunction !== 'function') {
        throw new Error(
            '[defineFunctionalComponent] '
            + "First argument 'renderFunction' must be a function");
    } else if (typeof meta !== 'object') { 
        throw new Error(
            '[defineFunctionalComponent] '
            + "Second argument 'meta' must be an object, null or undefined");
    }

    let adjustedMeta;
    
    try {
        adjustedMeta =
            determineComponentMeta(meta ? meta : renderFunction, true);
    } catch (error) {
        throw new Error('[defineFunctionComponent] ' + error.message);
    }

    const config = Object.assign({ render: renderFunction }, adjustedMeta);

    return  defineComponent(config);
}
