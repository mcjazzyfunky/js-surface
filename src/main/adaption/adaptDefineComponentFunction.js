import validateComponentConfig from '../validation/validateComponentConfig';
import normalizeComponentConfig from '../helper/normalizeComponentConfig';
import printError from '../helper/printError';

export default function adaptDefineComponentFunction({
    createElement,
    determineComponentExtras,
    BaseComponent,
    Adapter
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
        } else if (component !== undefined && typeof component !== 'function') {
            errorMsg = 'Optional second argument must be a function';
        } else if (component && component.normalizeComponentClass !== undefined
            && typeof component.normalizeComponentClass !== 'function') {

            errorMsg = 'Member "normalizeComponentClass" of component class '
                + 'must be a function';
        } else if (BaseComponent & component
            && component.normalizeComponentClass
            && component.prototype instanceof BaseComponent) {

            errorMsg = Adapter.name[0].toUpperCase() + Adapter.name.substr(1)
                + ' component class must not have a static method called '
                + ' "normalizeComponentClass"';
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
                main.normalizeComponentClass
                    ? config.main.normalizeComponenatClass(partialConfig)
                    : config.main;

            ret = componentize(adjustedMain, { ...partialConfig, main })
                .factory;
        } else if (!component) {
            ret = component => defineComponent(partialConfig, component);
        } else {
            const isFunctional =
                !component.normalizeComponenatClas
                && (!BaseComponent
                    || !(component.prototype instanceof BaseComponent));

            if (isFunctional) {
                ret = componentize(component,
                    { ...partialConfig, render: component });
            } else if (component.normalizeComponenatClass) {
                const main = component.normalizeComponenatClass(partialConfig); 

                ret = componentize(main, { ...partialConfig, main });
            }
        }

        return ret;
    }

    defineComponent._jsx = createElement;
    defineComponent._jsxFrag = null;

    return defineComponent;

    // ---------------------------------------------------
    
    function componentize(component, fullConfig) {
        const
            isFunctional = fullConfig.render !== undefined,    
            normalizedConfig = normalizeComponentConfig(fullConfig),
            
            ret = isFunctional
                ?  component.bind(null)
                : class Component extends component {},

            { type, ...extras } = determineComponentExtras
                ? determineComponentExtras(normalizedConfig)
                : { type: ret },

            factory = createComponentFactory(type, normalizedConfig);

        Object.assign(ret, extras);

        Object.defineProperty(ret, 'type', {
            get() { 
                return this === ret ? type : undefined;
            }
        });

        Object.defineProperty(ret, 'factory', {
            get() {
                return this === ret ? factory : undefined;
            }
        });

        return ret;
    }
    
    // ---------------------------------------------------

    function createComponentFactory(componentType, normalizedConfig) {
        const ret = createElement.bind(componentType);

        ret.meta = Object.freeze({
            type: componentType,
            factory: ret,
            config: normalizedConfig,
            Adapter
        });

        Object.freeze(ret);

        return ret;
    }
}

function prettifyErrorMsg(errorMsg, config) {
    return config && typeof config === 'object'
        && typeof config.displayName === 'string'
        && typeof config.displayName.trim().length > 0
        ? '[defineComponent] Invalid configuration for component '
            + `"${config.displayName}": ${errorMsg} `
        : `[defineComponent] Invalid component configuration: ${errorMsg}`;
}

/*
    function createComponentClass(component, meta) {

    }

    function createComponentFunction(compoent, meta) {

    }

    function createComponentFactory(config, componentType = null) {
        const
            normalizedConfig = normalizeComponentConfig(config);


        



    }

    function decorateComponent(componentType, config) {
        const
            normalizedConfig = normalizeComponentConfig(config),

            meta = Object.freeze({
                type: componentType,
                factory: createFactory(componentType), 
                config: normalizedConfig,
                Adapter
            });

        let ret = componentType;

        if (decorateComponent
                && (config.render
                    || BaseComponentClass
                        && componentType.prototype instanceof BaseComponentClass)) {

            ret = decorateComponent(ret, normalizedConfig);
        }

        if (ret === componentType) {
            ret = config.render
                ? function () {
                    return ret(...arguments);
                }
                : class Component extends ret {
                    constructor() {
                        super(...arguments);
                    }
                };
        }

        ret.meta = meta;
        ret.type = componentType;

        return ret;
    }

    function createFactory(componentType, normalizedConfig) {
        const
            ret = Adapter.api.Surface.createElement.bind(null, componentType);

        ret.type = componentType;

        ret.meta = {
            type: componentType,
            config: normalizedConfig,
            factory: ret,
            Adapter
        };

        ret.___isSurfaceComponentFactory = true;

        Object.freeze(ret.meta);
        Object.freeze(ret);

        return ret;
    }
}



        } else {
            if (component === undefined) {
                ret = component => decorateComponent(component, meta);
            } else {
                ret = decorateComponent(component, meta);
            }
        }

        // TODO - validate config

        const
            meta = Object.assign({}, config),
            { render, main } = meta,
            renderIsSet = render !== undefined,
            mainIsSet = main !== undefined;
        
        delete meta.render;
        delete meta.main;

            if (component !== undefined) {
                throw new TypeError('[defineComponent] TODO'); // TODO
            } else if (renderIsSet) {
                ret = decorateComponentFunction(render, meta).factory;
            } else if (mainIsSet && typeof main.standardizeComponent !== 'function') {
                ret = defineStandardComponent(
                    Object.assign(
                        { main: main.standardizeComponent(meta) }, meta));
            } else if (BaseComponentClass && !(main.prototype instanceof BaseComponentClass)) {
                if (typeof main.standardizeComponent === 'function') {
                    const
                        init = main.standardizeComponent(meta),
                        config = Object.assign({ init }, meta);

                    const derivedClass =  class Component extends main {};

                    derivedClass.factory =
                        createFactory(defineComponent(config), config, Adapter);

                    ret = derivedClass.factory;
                } else {
                    throw new TypeError('Given class is not a component class');
                }
            } else {
                ret = decorateComponentClass(main, meta).factory;
            }
        } else {
            if (component !== undefined) {
                return (component.prototype instanceof BaseComponentClass)
                    ? decorateComponentClass(component, meta)
                    : decorateComponentFunction(component, meta);
            } else {
                ret = component => {
                    if (typeof ret !== 'function') {
                        throw new TypeError('[defineComponent] TODO'); // TODO
                    }

                    return (component.prototype instanceof BaseComponentClass)
                        ? decorateComponentClass(component, meta)
                        : decorateComponentFunction(component, meta);
                };
            }
        }

        return ret;
    }

    defineComponent._jsx = adaptedCreateElementFunction;
    defineComponent._jsxFrag = Fragment;

    return defineComponent; 
}


*/
