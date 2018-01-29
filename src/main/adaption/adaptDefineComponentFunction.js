import createFactory from '../helper/createFactory';

export default function adaptDefineComponentFunction({
    BaseComponentClass,
    adaptedCreateElementFunction,
    decorateComponentFunction,
    decorateComponentClass,
    defineStandardComponent,
    Fragment,
    Adapter
}) {
    function defineComponent(config, component = undefined) {
        let ret;

        const
            isConfig = config && typeof config === 'object',
            { render, init, main, ...meta } = config || {},
            renderIsSet = render !== undefined,
            initIsSet = init !== undefined,
            mainIsSet = main !== undefined;

        if (!isConfig) {
            throw new TypeError(
                '[defineComponent] First argument must be a '
                + 'component configuration object');
        } else if (renderIsSet && initIsSet) {
            throw new TypeError(
                '[defineComponent] First argument must not have '
                + 'both parameters "render" and "init" set at once');
        } else if (renderIsSet && mainIsSet) {
            throw new TypeError(
                '[defineComponent] First argument must not have '
                + 'both parameters "render" and "main" set at once');
        } else if (initIsSet && mainIsSet) {
            throw new TypeError(
                '[defineComponent] First argument must not have '
                + 'both parameters "init" and "main" set at once');
        } else if (renderIsSet || initIsSet || mainIsSet) {
            if (component !== undefined) {
                throw new TypeError('[defineComponent] TODO'); // TODO
            } else if (renderIsSet) {
                ret = decorateComponentFunction(render, meta).factory;
            } else if (initIsSet) {
                ret = defineStandardComponent(config);
            } else if (!(main.prototype instanceof BaseComponentClass)) {
                if (typeof main.buildComponentInitializer === 'function') {
                    const
                        init = main.buildComponentInitializer(meta),
                        config = { init, ...meta };

                    ret = class Component extends main {};
            
                    ret.factory =
                        createFactory(defineComponent(config), config, Adapter);
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
