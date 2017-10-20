import determineDisplayName from 
    '../internal/helper/determineDisplayName';

import determinePropertiesConfig from 
    '../internal/helper/determinePropertiesConfig';

import { defineFunctionalComponent as defineComponent } from 'js-surface';

export default function defineFunctionalComponent(classOrConfig) {
    const
        type = typeof classOrConfig,
        isFunction = type === 'function',
        isObject = classOrConfig && type === 'object';

    if (!isFunction && !isObject) {
        throw '[defineFunctionComponent] First argument must either be '
            + 'a render function or a configuration object';
    } else if (isFunction && classOrConfig.contextTypes !== undefined) {
        throw "Illegal static class member 'contextTypes' (feature not supported)";
    }

    let ret;

    if (isObject) {
        ret = defineComponent(classOrConfig);
    } else {  
        const 
            displayName = determineDisplayName(classOrConfig),
            properties = determinePropertiesConfig(classOrConfig),
            render = classOrConfig,
            config = { displayName, render };

        if (properties) {
            config.properties = properties;
        }

        ret = defineComponent(config);
    }

    return ret;
}
