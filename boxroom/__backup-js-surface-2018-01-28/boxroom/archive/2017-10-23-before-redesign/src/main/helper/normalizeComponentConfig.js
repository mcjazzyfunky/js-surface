import { REGEX_CALLBACK_PROPERTY_NAME } from '../constant/constants';

export default function normalizeComponentConfig(config) {
    let ret;

    if (!config
        || (!Array.isArray(config.properties)
            && !Array.isArray(config.provides))) {

        ret = config;
    } else {
        if (typeof config === 'function') {
            ret = function (...args) {
                config.apply(this, args);
            };

            ret.prototype = config.prototype;
        } else {
            ret = Object.assign({}, config);
        }

        if (config.properties) {
            ret.properties = normalizePropertiesConfig(config.properties);
        }
    }

    return ret;
}

function normalizePropertiesConfig(propertiesConfig) {
    let ret;

    if (!Array.isArray(propertiesConfig)) {
        ret = propertiesConfig;
    } else {
        ret = {};

        for (let key of propertiesConfig) {
            ret[key] = {
                defaultValue: null
            };

            if (key) {
                if (key.match(REGEX_CALLBACK_PROPERTY_NAME)) {
                    ret[key].type = Function;
                    ret[key].nullable = true;
                }
            }
        }
    }

    return ret;
}
