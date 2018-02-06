export default function convertConfig(config) {
    // config is already normalized

    const ret = {
        displayName: config.displayName,
        defaultProps: {},
        propTypes: {},
        
        // contextTypes will be handled by wrapper component
        // (=> higher-order component)
        contextTypes: null,
        childContextTypes: null
    };

    ret.displayName = config.displayName;

    if (config.properties) {
        for (const propName of Object.keys(config.properties)) {
            const propCfg = config.properties[propName];

            ret.propTypes[propName] = dummyValidator;

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

    if (config.childContext) {
        ret.childContextTypes = {};

        for (const key of config.childContext) {
            ret.childContextTypes[key] = dummyValidator;
        }
    }

    return ret;
}

// ------------------------------------------------------------------

const dummyValidator = function validator() {};
