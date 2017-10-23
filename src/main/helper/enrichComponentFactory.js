import validateProperty from '../validation/validateProperty';

export default function enrichComponentFactory(factory, config, defineComponent) {
    const
        functional = typeof config.render === 'function',
        type = factory;

    factory.meta = Object.assign({ functional, type }, config);
    
    factory.withDefaults = defaultProps => {
        if (!defaultProps || typeof defaultProps !== 'object') {
            throw new Error(`[${config.displayName}.withDefaults] `
                + "First argument 'defaultProps' must be an object");
        }
        
        const keysOfDefaults = Object.keys(defaultProps);
        
        if (keysOfDefaults.length === 0) {
            throw new Error(`[${config.displayName}.withDefaults] `
                + "First argument 'defaultProps' must not be an empty");
        }

        const
            propNames = Object.keys(config.properties),
            newConfig = Object.assign({}, config);
            
        for (const propName of propNames) {
            newConfig.properties[propName] = Object.assign({}, config.properties[propName]);
        }
        
        for (const keyOfDefault of keysOfDefaults) {
            const propConfig = config.properties[keyOfDefault];
            
            if (!propConfig) {
                throw new Error(`[${config.displayName}.withDefaults] `
                    + `Component does not have a property named '${keyOfDefault}'`);
            }
            
            const
                { type, nullable, constraint } = propConfig,
                valueOfDefault = defaultProps[keyOfDefault],
                err = validateProperty(valueOfDefault, keyOfDefault, type, nullable, constraint);
            
            if (err) {
                throw new Error(`[${config.displayName}.withDefaults] ${err.message}`);
            }
            
            newConfig.properties[keyOfDefault].defaultValue = valueOfDefault;
        }
        
        const newFactory = defineComponent(newConfig);
        newFactory.meta.type = factory.meta.type;
        return newFactory;
    };
}
