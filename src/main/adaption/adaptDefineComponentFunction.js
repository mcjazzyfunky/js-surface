import validateComponentConfig from '../validation/validateComponentConfig';
import normalizeComponentConfig from '../helper/normalizeComponentConfig';
import createFactory from '../helper/createFactory';
import printError from '../helper/printError';
export default function adaptDefineComponentFunction({
    createElement,
    Adapter,
    BaseComponent,
    normalizeBaseComponent,
    decorateComponent,
    createStandardComponentType
}) {
    function defineComponent(config, component = undefined) {
        let
            ret = null,
            errorMsg = null;

        const
            { main, render, ...partialConfig } = config,
            
            isFullConfig = config
                && (render !== undefined || main !== undefined),

            validationResult = validateComponentConfig(config, !isFullConfig);

        if (validationResult !== null) {
            errorMsg = validationResult.message;
        } else if (isFullConfig && component !== undefined) {
            errorMsg = 'Not allowed to pass a second argument'
                + 'because the first argument is already a full '
                + 'component configuration';
        } else if (component !== undefined
                && typeof component !== 'function'
                && typeof component.normalizeComponent !== 'function') {console.log(111, component)
            errorMsg = 'Optional second argument must be a function or '
                + 'object with a function property called "normalizeCompnent"';
        } else if (component && component.normalizeComponent !== undefined
            && typeof component.normalizeComponent !== 'function') {

            errorMsg = 'Member "normalizeComponent" of component class '
                + 'must be a function';
        } else if (BaseComponent & component
            && component.normalizeComponent
            && component.prototype instanceof BaseComponent) {

            errorMsg = Adapter.name[0].toUpperCase() + Adapter.name.substr(1)
                + ' component class must not have a static method called '
                + ' "normalizeComponent"';
        }
        
        if (errorMsg) {
            errorMsg = prettifyErrorMsg(errorMsg, config);
            printError(errorMsg);
            throw new TypeError(errorMsg);
        }

        if (render) {
            ret = componentize(render, { ...partialConfig, render }).factory;
        } else if (main) {
            const adjustedMain =
                main.normalizeComponent
                    ? main.normalizeComponent(partialConfig)
                    : main;

            ret = componentize(adjustedMain,
                { ...partialConfig, main: adjustedMain })
                .factory;
        } else if (!component) {
            ret = component => defineComponent(partialConfig, component);
        } else {
            const
                componentExtendsBaseComponent =
                    !!BaseComponent
                        && component.prototype instanceof BaseComponent,
                
                isFunctional = !component.normalizeComponenatClas
                    && !componentExtendsBaseComponent;

            if (isFunctional) {
                ret = componentize(component,
                    { ...partialConfig, render: component });
            } else if (component.normalizeComponenatClass) {
                const main = component.normalizeComponenatClass(partialConfig); 

                ret = componentize(component, { ...partialConfig, main });
            } else {
                const main = normalizeBaseComponent(component);

                ret = componentize(component, { ...partialConfig, main });
            }
        }

        return ret;
    }

    defineComponent._jsx = createElement;
    defineComponent._jsxFrag = null;

    return defineComponent;

    // ---------------------------------------------------
    
    function componentize(component, fullConfig) {
        const normalizedConfig = normalizeComponentConfig(fullConfig);

        let ret;

        if (fullConfig.render || BaseComponent && component.prototype instanceof BaseComponent) {
            ret = decorateComponent(component, normalizedConfig);
        } else {
            ret = createStandardComponentType(fullConfig);
            ret.type = ret;
        }
        
        const
            type = ret.type,
            factory = createFactory(type, normalizedConfig, Adapter);

        Object.defineProperty(ret, 'factory', {
            get() {
                return this === ret ? factory : undefined;
            }
        });

        Object.freeze(ret);

        return ret;
    }
}

function prettifyErrorMsg(errorMsg, config) {
    return config && typeof config === 'object'
        && typeof config.displayName === 'string'
        && config.displayName.trim().length > 0
        ? '[defineComponent] Invalid configuration for component '
            + `"${config.displayName}": ${errorMsg} `
        : `[defineComponent] Invalid component configuration: ${errorMsg}`;
}
