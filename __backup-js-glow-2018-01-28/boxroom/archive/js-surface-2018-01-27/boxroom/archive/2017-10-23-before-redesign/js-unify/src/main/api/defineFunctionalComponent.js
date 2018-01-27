import determineComponentMeta from 
    '../internal/helper/determineComponentMeta';

import { defineComponent } from 'js-surface';

export default function defineFunctionalComponent(config, meta = null) {
    const
        configType = typeof config,
        configIsObject = config !== null && configType === 'object',
        configIsFunction = configType === 'function';

    if (!configIsFunction && !configIsObject) {
        throw new Error(
            '[defineFunctionalComponent] '
            + "First argument 'config' must either be an object "
            + 'or an render function');
    } else if (typeof meta !== 'object') { 
        throw new Error(
            '[defineFunctionalComponent] '
            + "Second argument 'meta' must be an object, null or undefined");
    }

    let adjustedMeta;
    
    try {
        adjustedMeta =
            determineComponentMeta(meta ? meta : config, true, !!meta);
    } catch (error) {
        throw new Error('[defineFunctionComponent] ' + error.message);
    }

    const
        render = configIsObject ? config.render : config,
        stdConfig = Object.assign({ render }, adjustedMeta);

    return  defineComponent(stdConfig);
}
