import validateComponentConfig from '../validation/validateComponentConfig';
import ConfigValues from '../system/ConfigValues';
import warn from '../helper/warn';

export default function adaptDefineComponentFunction(
    defineFunctionalComponent,
    defineStandardComponent) {

    return function defineComponent(config) {
        const
            isObject = config && typeof config === 'object',
            isFunctional = isObject && typeof config.render === 'function',
            isStandard = isObject && typeof config.init === 'function',
            hasRender = isObject && config.render !== undefined,
            hasInit = isObject && config.init !== undefined;

        if (ConfigValues.validateDefs === true) {
            const error = validateComponentConfig(config);

            if (error) {
                warn(error.message);

                warn('Negatively validated component configuration:',
                    config);

                throw new Error(`[defineComponent] ${error.message}`);
            }


            if (!hasRender && !hasInit) {
                throw new Error(
                    "[defineComponent] Config must either provide a function 'init' or a function 'render'");
            } else if (hasRender && hasInit) {
                throw new Error(
                    "[defineComponent] Config must not provide both functions 'init' and 'render'");      
            } else if (hasRender && !isFunctional) {
                throw new Error(
                    "[defineComponent] Config parameter 'render' has to be a function");
            } else if (hasInit && !isStandard) {
                throw new Error(
                    "[defineComponent] Config parameter 'init' has to be a function");
            }
        }

        return isFunctional
            ? defineFunctionalComponent(config)
            : defineStandardComponent(config);
    };
}