const REGEX_CALLBACK_PROPERTY_NAME = /^on([A-Z]|-)*.$/;

export default function normalizeComponentConfig(config) {
    let { main, ...ret } = config;

    if (main && main.normalizeComponent) {
        const result = main.normalizeComponent(config);

        if (!result || typeof result !== 'object') {
            throw TypeError('Result of "normalizedComponent" must be an object');
        } else if (!result.render && !result.init) {
            throw TypeError('Result of "normalizedComponent" must return either a "render" or "init" function');
        } else if (result.render !== undefined && typeof result.render !== 'function') {
            throw TypeError('Result of "normalizedComponent" does not have a valid "render" function');
        } else if (result.init !== undefined && typeof result.init !== 'function') {
            throw TypeError('Result of "normalizedComponent" does not have a valid "init" function');
        } else if (result.render) {
            ret.render = result.render;
        } else {
            ret.init = result.init;
        }
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
                    const normalizedInject = {
                        context: inject.context
                    };

                    if (typeof inject.select === 'function') {
                        normalizedInject.select = inject.select;
                    }

                    ret.properties[key].inject =
                        Object.freeze(normalizedInject);
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

    if (config.methods && config.methods.length > 0) {
        ret.methods = config.methods;
    }

    if (config.childContext && config.childContext.length > 0) {
        ret.childContext = config.childContext;
    }

    return ret;
}
