import validateProperty from '../validation/validateProperty';

export default function enrichCompnentFactory(factory, config, componentFactoryCreator) {
    const
        functional = typeof config.render === 'function',
        type = factory;
    
    factory.meta = Object.assign({ functional, type }, config);
    
    factory.withDefaults = defaultProps => {
        if (!defaultProps || typeof defaultProps !== 'object') {
            throw new Error(`[${config.name}.withDefaults] `
                + "First argument 'defaultProps' must be an object");
        }
        
        const keysOfDefaults = Object.keys(defaultProps);
        
        if (keysOfDefaults.length === 0) {
            throw new Error(`[${config.name}.withDefaults] `
                + "First argument 'defaultProps' must not be an empty");
        }

        const
            propNames = Object.keys(config.properties),
            newConfig = Object.assign({}, config);
            
        for (const propName of propNames) {
            newConfig[propName] = Object.assign({}, config.properties[propName]);
        }
        
        for (const keyOfDefault of keysOfDefaults) {
            const propConfig = config.properties[keyOfDefault];
            
            if (!propConfig) {
                throw new Error(`[${config.name}.withDefaults] `
                    + `Component does not have a property called '${keyOfDefault}'`);
            }
            
            const
                { type, nullable, constraint } = propConfig,
                valueOfDefault = defaultProps[keyOfDefault],
                err = validateProperty(valueOfDefault, keyOfDefault, type, nullable, constraint);
            
            if (err) {
                throw new Error(`[${config.name}.withDefaults] ${err.message}`);
            }
            
            newConfig[keyOfDefault].defaultValue = valueOfDefault;
        }
        
        const newFactory = componentFactoryCreator(newConfig);
        
        newFactory.meta.type = factory;
        
        return newFactory;
    };
}
