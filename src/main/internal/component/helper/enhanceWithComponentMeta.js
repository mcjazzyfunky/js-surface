export default function enhanceWithComponentMeta(componentFunc, config) {
    componentFunc.displayName = config.displayName;
/*
    const properties = config.properties;

    if (properties) {
        const injectionPropKey = [];

        for (let key of Object.keys(properties)) {
            if (properties[key].inject) {
                injectionPropKey.push(key);
            }
        }

        if (injectionPropKey.length > 0) {
            const contextTypes = {};

            for (let key of injectionPropKey) {
                contextTypes[key] = () => null;
            }

            componentFunc.contextTypes = contextTypes;
        }

    }
*/
}