import determineComponentMeta from 
    '../internal/helper/determineComponentMeta';

import { defineComponent } from 'js-surface';

export default function defineFunctionalComponent(config) {
    const
        configType = typeof config,
        configIsObject = config !== null && configType === 'object',
        configIsFunction = configType === 'function';

    if (!configIsFunction && !configIsObject) {
        throw new Error(
            '[defineFunctionalComponent] '
                + "First argument 'config' must either be an object "
                + 'or an render function');
    }

    let meta;
    
    try {
        meta = determineComponentMeta(config, true);
    } catch (error) {
        throw new Error('[defineFunctionComponent] ' + error.message);
    }

    const
        render = configIsObject ? config.render : config,
        jsSurfaceConfig = Object.assign({ render }, meta);

    return  defineComponent(jsSurfaceConfig);
}
