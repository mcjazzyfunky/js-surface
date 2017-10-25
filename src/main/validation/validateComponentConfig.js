import {
    REGEX_DISPLAY_NAME,
    REGEX_PROPERTY_NAME,
    REGEX_METHOD_NAME,
    FORBIDDEN_METHOD_NAMES
} from '../constant/constants';

import validateArray from './validateArray';
import validateObject from './validateObject';

const
    allowedFunctionalConfigKeys =
        new Set(['displayName', 'properties', 'render']),

    allowedStandardConfigKeys =
        new Set( ['displayName', 'properties', 'init', 'methods', 'provides']),

    allowedPropertyConfigKeys = 
        new Set(
            ['type', 'constraint', 'nullable', 'defaultValue',
                'getDefaultValue', 'inject']),

    propertyConfigValidator = it => {
        let error = null;

        if (it !== undefined && typeof it !== 'object') {
            error = 'Must be a object or empty';
        } else if (it.type !== undefined
            && it.type !== null
            && typeof it.type !== 'function') {

            error = "Property parameter 'type' must be a class "
                +  'constructor or empty';
        } else if (it.nullable !== undefined
            && it.nullable !== null
            && typeof it.nullable !== 'boolean') {
            
            error = "Property parameter 'nullable' must be boolean or empty";
        } else if (it.constraint !== undefined
            && it.constraint !== null
            && typeof it.constraint !== 'function'
            && (typeof it.constraint !== 'object'
                || typeof it.constraint.validate !== 'function')) {

            error = "Property parameter 'constraint' must be a function "
                + "or an object that has a 'validate' method or empty";
        } else if (it.getDefaultValue !== undefined
            && it.getDefaultValue !== null
            && Object.hasOwnProperty('defaultValue')) {

            error = "Not allowed to set property paramters 'defaultValue' "
                + "and 'getDefaultValue' at the same time";
        } else if (it.getDefaultValue !== undefined
            && it.getDefaultValue !== null
            && typeof it.getDefaultValue !== 'function') {

            error = "Property parameter 'getDefaultValue' must be"
                + 'a function or empty';
        } else if (it.inject !== undefined && it.inject !== null
            && typeof it.inject !== 'boolean') {
            
            error = "Property parameter 'inject' must be boolean or empty";
        } else  {
            for (const key of Object.keys(it)) {
                if (!allowedPropertyConfigKeys.has(key)) {
                    error = `Illegal property parameter '${key}'`;
                    break;
                }
            }
        }

        return error;
    };

export default function validateComponentConfig(config) {
    let
        ret = null,
        error = null;

    if (!config || typeof config !== 'object') {
        error = 'Must be an object';
    } else {
        const
            isFunctional = typeof config.render === 'function',
            isStandard = typeof config.init === 'function',
            hasRender = config.render !== undefined,
            hasInit = config.init !== undefined;

        if (!hasRender && !hasInit) {
            error =
                "Configuration must either provide a function 'init' "
                    + "or a function 'render'";
        } else if (hasRender && hasInit) {
            error =
                "Configuration must not provide both functions 'init' and 'render'";      
        } else if (hasRender && !isFunctional) {
            error =
                "Configuration parameter 'render' has to be a function";
        } else if (hasInit && !isStandard) {
            error =
                "Configuration parameter 'init' has to be a function";
        } else if (!config.displayName) {
            error = "Configuration parameter 'displayName' is missing";
        } else if (typeof config.displayName !== 'string') {
            error = "Configuration parameter 'displayName' must be a string";
        } else if (!config.displayName.match(REGEX_DISPLAY_NAME)) {
            error = "Configuration parameter 'displayName' must match regex "
                + REGEX_DISPLAY_NAME;
        } 
    }
    
    if (!error) {
        const
            allowedKeys =
                config.render
                    ? allowedFunctionalConfigKeys
                    : allowedStandardConfigKeys;
            
        error = validateObject(config, key => allowedKeys.has(key));
    }

    if (!error) {
        const properties = config.properties;

        let validationResult = null;

        if (properties !== undefined && properties !== null) {
            if (Array.isArray(properties)) {
                validationResult = validateArray(
                    properties,
                    it => REGEX_PROPERTY_NAME.test(it),
                    true, true);
            } else {
                validationResult = validateObject(
                    properties,
                    it => REGEX_PROPERTY_NAME.test(it),
                    propertyConfigValidator,
                    true);
            }
        }

        if (validationResult) {
            error = "Invalid configuration parameter 'properties' => "
                + validationResult.message;
        }
    }

    if (!error && config.methods) {
        const validationResult = validateArray(
            config.methods,
            it => REGEX_METHOD_NAME.test(it)
                && !FORBIDDEN_METHOD_NAMES.has(it),
            true,
            true);

        if (validationResult) {
            error = "Invalid configuration parameter 'methods' => "
                + validationResult.message;
        }
    }

    if (!error && config.provides) {
        const validationResult = validateArray(
            config.provides,
            it => REGEX_PROPERTY_NAME.test(it),
            true,
            true);

        if (validationResult) {
            error = "Invalid configuration parameter 'provides' => "
                + validationResult.message;
        }
    }

    if (error) {
        const message =
            error && error.message
                ? error.message
                : String(error),

            // TODO: This is surely pretty ugly (but makes the error message
            // more understandable) - has to be replaced by a better solution
            tokens = message.split(/.*?'([^']+)'.*?/).filter(it => it),
            path = tokens.slice(0, -1).join('.'),
            shortMessage = message.replace(/^.*:\s*/, ''),   
            info = `at '${path}': ${shortMessage}`;

        if (!config || typeof config.displayName !== 'string') {
            ret = new Error(`Invalid component configuration ${info}`);
        } else {
            ret = new Error('Invalid component configuration '
                + `for '${config.displayName}' ${info}`);
        }
    }

    return ret;
}
