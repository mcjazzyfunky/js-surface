export default function createFactory(type, config, Adapter) {
    const ret = Adapter.api.Surface.createElement.bind(null, type);

    ret.type = type;

    ret.meta = {
        isComponent: true,
        type,
        factory: ret,
        Adapter
    };

    if (config) {
        ret.meta.config = config;
    }

    Object.freeze(ret.meta);
    Object.freeze(ret);

    return ret;
}
