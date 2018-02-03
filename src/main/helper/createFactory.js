export default function createFactory(type, normalizedConfig, Adapter) {
    const ret = Adapter.api.Surface.createElement.bind(null, type);

    ret.type = type;

    ret.meta = {
        type,
        factory: ret,
        Adapter
    };

    if (normalizedConfig) {
        ret.meta.config = normalizedConfig;
    }

    ret.__isSurfaceComponentFactory = true; // TODO - really a good idea?

    Object.freeze(ret.meta);
    Object.freeze(ret);

    return ret;
}
