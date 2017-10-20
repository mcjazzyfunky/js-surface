import Component from './Component';

import { defineStandardComponent } from 'js-surface';
import { checkPropTypes } from 'prop-types';

export function defineClassComponent(configOrClass) {
    let ret;
    
    const
        type = typeof configOrClass,
        isObject = type === 'object' && configOrClass !== null,
        isFunction = type === 'function',
        isComponentClass = isFunction && configOrClass.prototype instanceof Component;
    
    if (!isObject && !isComponentClass) {
        throw new Error(
            '[defineClassComponent] First argument must either be an '
                + 'object or a subclass of Component');
    }

    try {    
        ret = isObject
            ? defineClassComponentByConfig(configOrClass)
            : defineClassComponentByClass(configOrClass);
    } catch (err) {
        let msg = err && typeof err.message === 'string'
            ? err.message.trim()
            : null;
            
        if (!msg) {
            msg = String(err);
        }

        throw new Error('[defineClassComponent] ' + msg);
    }

    return ret;
}

function defineClassComponentByConfig(config) {
    if (typeof config.displayName !== 'string') {
        throw "Configuration parameter 'displayName' must be a string";
    } else if (config.properties !== undefined
        && typeof config.properties !== 'object') {
        
        throw "Configuration parameter 'properties' must be "
            + 'either be an object or undefined';
    } else if (typeof config.methods !== undefined
        && !Array.isArray(config.properties)) {
        
        throw "Configuration parameter 'methods' must be "
            + 'either be a string array or undefined';
    } else if (typeof config.class !== 'function'
        || !(config.class.prototype instanceof Component)) {

        throw "Configuration parameter 'class' must be "
            + 'a component class extending the Component base class';
    } else if (config.init !== undefined) {
        throw "Configuration must not have a parameter 'init'";
    }

    const adjustedConfig = Object.assign({}, config);

    adjustedConfig.init = buildInitFunction(config);

    return defineStandardComponent(config);
}

function defineClassComponentByClass(componentClass) {
    if (componentClass.contextTypes !== undefined) {
        throw "Illegal static class member 'contextTypes' (feature not supported)";
    } else if (componentClass.childContextTypes !== undefined) {
        throw "Illegal static class member 'childContextTypes' (feature not supported)";
    }

    const
        newClass = class CustomComponent extends componentClass {},
        { propTypes, defaultProps } = componentClass,
        config = {},
        properties = {};

    newClass.displayName = undefined;
    newClass.propTypes = undefined;
    newClass.defaultProps = undefined;
    newClass.contextTypes = undefined;
    newClass.childContextTypes = undefined;

    config.displayName = String(componentClass.dispayName || 'Anonymous');

    if (propTypes && typeof propTypes === 'object') {
        for (let key of Object.keys(propTypes)) {
            properties[key] = {
                defaultValue: undefined
            };

            const propType = propTypes[key];

            if (typeof validator === 'function') {
                properties[key].constraint =
                    convertPropType(propType, key, config.displayName);
            } else {
                throw `Illegal prop type for property '${key}' - must be a function`;
            }
        }
    }  

    if (defaultProps && typeof defaultProps === 'object') {
        for (let key of Object.keys(defaultProps)) {
            properties[key] = properties[key] || {};
            properties[key].defaultValue = defaultProps[key];
        }
    }

    return defineClassComponentByConfig(config);
}

function convertPropType(propType, propName, componentDisplayName) {
    const propTypes = { [propName]: propType };

    return it => {
        let ret = null;

        checkPropTypes(
            { [propName]: it},
            propTypes,
            'prop',
            componentDisplayName,
            () => { ret = new Error('Invalid value'); });

        return ret;
    };
}

function buildInitFunction(config) {

}
