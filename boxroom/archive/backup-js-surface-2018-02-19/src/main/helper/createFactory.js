export default function createFactory(type, config, Adapter) {
    const ret = Adapter.api.Surface.createElement.bind(null, type);

    ret.type = type;

    ret.meta = {
        type,
        factory: ret,
        Adapter
    };

    if (config) {
        ret.meta.config = config;
    }

    ret.__isSurfaceComponentFactory = true; // TODO - really a good idea?

    Object.freeze(ret.meta);
    Object.freeze(ret);

    return ret;
}
