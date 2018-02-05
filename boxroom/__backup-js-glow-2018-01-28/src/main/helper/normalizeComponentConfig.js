const REGEX_CALLBACK_PROPERTY_NAME = /^on([A-Z]|-)*.$/;

export default function normalizeComponentConfig(config) {
    let ret = {};

    if (config.displayName) {
        ret.displayName = config.displayName;
    }
    
    if (config.properties && Object.keys(config.properties).length > 0) {
        ret.properties = {};
        
        if (!Array.isArray(config.properties)) {
            for (const key of Object.keys(config.properties)) {
                const
                    type = config.properties[key].type,
                    constraint = config.properties[key].constraint,
                    nullable = config.properties[key].nullable,
                    defaultValue = config.properties[key].defaultValue,
                    getDefaultValue = config.properties[key].getDefaultValue,
                    hasDefaultValue =
                        config.properties[key].hasOwnProperty('defaultValue'),
                    
                    inject = config.properties[key].inject;
                    

                ret.properties[key] = {};
                
                if (type) {
                    ret.properties[key].type = type;
                }
                
                if (constraint) {
                    if (typeof constraint === 'function') {
                        ret.properties[key].constraint = constraint;
                    } else {
                        ret.properties[key].constraint =
                            it => constraint.validate(it);
                    }
                }

                if (typeof nullable === 'boolean') {
                    ret.properties[key].nullable = nullable;
                }
                
                if (hasDefaultValue) {
                    ret.properties[key].defaultValue = defaultValue;
                } else if (getDefaultValue) {
                    ret.properties[key].getDefaultValue = getDefaultValue;
                }

                if (inject) {
                    ret.properties[key].inject = true;
                }
            }
        } else {
            for (const key of Object.keys(config.properties)) {
                ret.properties[key] = {
                    nullable: true,
                    defaultValue: null
                };

                if (key.match(REGEX_CALLBACK_PROPERTY_NAME)) {
                    ret.properties[key].type = Function;
                }
            }
        }
    }

    if (config.operations && config.operations.length > 0) {
        ret.operations = config.operations;
    }

    if (config.childContextKeys && config.childContextKeys.length > 0) {
        ret.childContextKeys = config.childContextKeys;
    }

    return ret;
}