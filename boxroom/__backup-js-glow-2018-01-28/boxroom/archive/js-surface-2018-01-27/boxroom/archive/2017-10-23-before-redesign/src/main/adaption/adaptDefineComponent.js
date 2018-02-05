export default function adaptDefineComponentFunction(
    defineFunctionalComponent,
    defineStandardComponent) {

    return function defineComponent(config) {
        if (!config || typeof config !== 'object') {
            throw new Error(
                "[defineComponent] First argument 'config' must be an object");
        }

        const
            isFunctional = typeof config.render === 'function',
            isStandard = typeof config.init === 'function',
            hasRender = config.render !== undefined,
            hasInit = config.init !== undefined;

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

        return isFunctional
            ? defineFunctionalComponent(config)
            : defineStandardComponent(config);
    };
}