import validateComponentConfig from '../validation/validateComponentConfig';
import normalizeComponentConfig from '../helper/normalizeComponentConfig';
import printError from '../helper/printError';

export default function adaptDefineComponentFunction({
    createElement,
    Adapter
}) {
    const
        adapterName = Adapter.name,
        isPreact = adapterName === 'preact',
        isReact = adapterName === 'react' || adapterName === 'react-native',
        isReactLike = isPreact || isReact,
        PreactComponent = isPreact ? Adapter.api.Preact.Component : null,
        ReactComponent = isReact ? Adapter.api.React.Component : null,
        ReactLikeComponent = PreactComponent || ReactComponent;

    function defineComponent(config, component = undefined) {
        let
            ret = null,
            errorMsg = null;

        const
            isFullConfig = config
                && (config.render !== undefined || config.main !== undefined),

            validationResult = validateComponentConfig(config, !isFullConfig);

        if (validationResult !== null) {
            errorMsg = validationResult.message;
        } else if (isFullConfig && component !== undefined) {
            errorMsg = 'Not allowed to pass a second argument'
                + 'because the first argument is already a full '
                + 'component configuration';
        } else if (component !== undefined && typeof component !== 'function') {
            errorMsg = 'Optional second argument must be a function';
        } else if (component && component.standardizeComponent !== undefined
            && typeof component.standardizeComponent !== 'function') {

            errorMsg = 'Member "standardizeComponent" of component function '
                + 'must be a function';
        } else if (isReactLike && component && component.standardizeComponent
            && component.standardizeComponent.prototype
                instanceof ReactLikeComponent) {

            errorMsg = 'Member "standardizeComponent" of component function '
                + 'must not be a '
                + adapterName[0].toUpperCase()
                + adapterName.substr(1)
                + ' component class';
        } else if (isReactLike && config.main
            && config.main.standardizeComponent
            && config.main.standardizeComponent.prototype
                instanceof ReactLikeComponent) {

            errorMsg = 'Member "standardizeComponent" of parameter "main" '
                + 'must not be a '
                + adapterName[0].toUpperCase()
                + adapterName.substr(1)
                + ' component class'
                + 'Property "standardizeComponent" must not be a React component class';
        }
        
        if (errorMsg) {
            errorMsg = prettifyErrorMsg(errorMsg, config);
            printError(errorMsg);
            throw new TypeError(errorMsg);
        }

        if (config.render) {
            ret = createComponentFactory(config);
        } else if (config.main) {
            const adjustedConfig =
                !config.main.standardizeComponent
                    ? config.main
                    : Object.assign({}, config,
                        { main: config.main.standardizeComponent });

            ret = createComponentFactory(adjustedConfig);
        } else if (!component) {
            ret = component => defineComponent(config, component);
        } else {
            let fullConfig;

            if (component.standardizeComponent) {
                ret = class Component extends component {};

                fullConfig = normalizeComponentConfig(Object.assign({
                    main: component.standardizeComponent,
                }, config));
            } else if (isReactLike && component.prototype instanceof ReactLikeComponent) {
                ret = class Component extends component {};
                
                fullConfig = normalizeComponentConfig(Object.assign({
                    main: config,
                }, config));
            } else {
                ret = function () {
                    return component(...arguments);
                };

                fullConfig = normalizeComponentConfig(Object.assign({
                    render: component,
                }, config));
            }

   //         if (decorateComponent) {
   //             decorateComponent(ret, fullConfig);
   //         }

            ret.factory = createComponentFactory(fullConfig);
        }

        return ret;
    }

    defineComponent._jsx = createElement;
    defineComponent._jsxFrag = null;

    return defineComponent;

    // ---------------------------------------------------

    function createComponentFactory(componentType, normalizedConfig) {
        const ret = (...args) => createElement(componentType, ...args);

        if (!componentType) {
            componentType = ret; 
        }

        ret.meta = Object.freeze({
            isComponent: true,
            type: componentType,
            factory: ret,
            config: normalizedConfig,
            Adapter
        });

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
