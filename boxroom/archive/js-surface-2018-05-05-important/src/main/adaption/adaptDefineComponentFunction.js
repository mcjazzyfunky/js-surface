import validateComponentConfig from '../validation/validateComponentConfig';
import normalizeComponentConfig from '../helper/normalizeComponentConfig';
import createFactory from '../helper/createFactory';
import printError from '../helper/printError';

export default function adaptDefineComponentFunction({
    createComponentType,
    createElement,
    Adapter
}) {
    function defineComponent(config) {
        const error = validateComponentConfig(config);

        if (error) {
            const errorMsg = prettifyErrorMsg(error.message, config);

            printError(errorMsg);
            throw new TypeError(errorMsg);
        }

        const
            normalizedConfig = normalizeComponentConfig(config),
            componentType = createComponentType(normalizedConfig),
            factory = createFactory(componentType, normalizedConfig, Adapter); 

        return factory;
    }

    defineComponent._jsx = createElement;
    defineComponent._jsxFrag = null;

    return defineComponent;
}

function prettifyErrorMsg(errorMsg, config) {
    return config && typeof config === 'object'
        && typeof config.displayName === 'string'
        && config.displayName.trim().length > 0
        ? '[defineComponent] Invalid configuration for component '
            + `"${config.displayName}": ${errorMsg} `
        : `[defineComponent] Invalid component configuration: ${errorMsg}`;
}
