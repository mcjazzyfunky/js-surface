import { REGEX_CALLBACK_PROPERTY_NAME } from '../constant/constants';

export default function normalizeComponentConfig(config) {
    let ret;

    if (!config
        || (!Array.isArray(config.properties)
            && !Array.isArray(config.childInjections))) {

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
            ret.properties = normalizePropertiesLikeConfig(config.properties);
        }

        if (config.childInjections) {
            ret.childInjections = normalizePropertiesLikeConfig(config.childInjections);
        }
    }

    return ret;
}

function normalizePropertiesLikeConfig(propertiesConfig) {
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
