export default function createLifecycleHandlers(
    lifecycleConfig, dispatch) {

    const
        ret = {},
        keys = Object.keys(lifecycleConfig);

    for (let i = 0; i < keys.length; ++i) {
        const
            key = keys[i],
            value = lifecycleConfig[key];

        ret[key] =
            typeof value === 'function'
                ? (...args) => dispatch(value(...args))
                : () => dispatch(value);
    }

    return ret;
}
