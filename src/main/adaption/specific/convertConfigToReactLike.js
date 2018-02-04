import normalizeComponentConfig from '../../helper/normalizeComponentConfig';

export default function convertConfig(config) {
    const ret = { defaultProps: {} };

    const cfg = normalizeComponentConfig(config);

    ret.displayName = cfg.displayName;

    if (cfg.properties) {
        for (const propName of Object.keys(cfg.properties)) {
            const propCfg = cfg.properties[propName];

            if (propCfg.inject) {
                ret.contextTypes = ret.contextTypes || {};
                ret.contextTypes[propName] = dummyValidator;
            } else {
                if (propCfg.hasOwnProperty('defaultValue') && propCfg.defaultValue === undefined) {
                    ret.defaultProps[propName] = undefined; // TODO?
                } else if (propCfg.defaultValue !== undefined) {
                    ret.defaultProps[propName] = propCfg.defaultValue;
                } else if (propCfg.getDefaultValue) {
                    Object.defineProperty(ret.defaultProps, propName, {
                        enumerable: true,

                        get: () => propCfg.getDefaultValue()
                    }); 
                }
            }
        }
    }

    if (cfg.childContext) {
        ret.childContextTypes = {};

        for (const key of cfg.childContext) {
            ret.childContextTypes[key] = dummyValidator;
        }
    }

    return ret;
}

// ------------------------------------------------------------------

const dummyValidator = function validator() {};
