// --- constants needed for the validation --------------------------
const
    VALID_CONFIG_KEYS = new Set(
        ['actions', 'displayName', 'events', 'handleError', 'initState',
            'lifecycle', 'operations', 'properties', 'render']), 

    VALID_PROPERTY_CONFIG_KEYS = new Set(
        ['type', 'constraint', 'nullable',
            'defaultValue', 'getDefaultValue', 'inject']),

    FORBIDDEN_OPERATION_NAMES = new Set(
        ['props', 'state', 'context', 'shouldComponentUpdate',
            'setState', 'componentWillReceiveProps',
            'componentWillMount', 'componentDidMount',
            'componentWillUpdate', 'componentDidUpdate',
            'componentDidCatch', 'constructor', 'forceUpdate']),

    REGEX_DISPLAY_NAME = /^[A-Z][a-zA-Z0-9_.]*$/,
    REGEX_PROPERTY_NAME = /^[a-z][a-zA-Z0-9]*$/,
    REGEX_ACTION_NAME = /^[a-z][a-zA-Z0-9]*$/,
    REGEX_OPERATION_NAME = /^[a-z][a-zA-Z0-9]*$/;

// --- the actual configuration validation function -----------------

export default function validateComponentConfig(config) {

    let errorMsg = null;

    if (config === null || typeof config !== 'object') {
        errorMsg = 'Component configuration must be an object';
    } else if (config.initDispatcher !== undefined
        && typeof config.initDispatcher !== 'function') {

        errorMsg = 'Parameter "initDispatcher" must be a function';
    } else if (config.init !== undefined
        && typeof config.init !== 'function') {

        errorMsg = 'Parameter "init" must be a function';
    } else if (config.initDispatcher && config.initState) {

        errorMsg = 'Parameter "initDispatcher" and "initState" must not '
            + 'be set both at once';
    } else if (config.provide !== undefined
        && typeof config.provide !== 'function') {
    
        errorMsg = 'Parameter "provide" must be a function';
    } else if (config === null
        || (config.lifecycle !== undefined
            && typeof config.lifecycle !== 'function')) {

        errorMsg = 'Parameter "lifecycle" must be an object';
    } else if (config === null
        || (config.events !== undefined
            && typeof config.event !== 'object')) {
        
        errorMsg = 'Parameter "events" must be an object';
    } else if (config.actions === undefined
        && (config.lifecycle !== undefined || config.event !== undefined)) {

        errorMsg = 'Missing parameter "actions"';
    }

    errorMsg = errorMsg
        || validateParamDisplayName(config.displayName)
        || validateParamProperties(config.properties)
        || validateParamActions(config.actions)
        || validateParamProvides(config.provides)
        || validateParamOperations(config.operations);

    if (!errorMsg) {
        for (const key of Object.keys(config)) {
            if (!VALID_CONFIG_KEYS.has(key)) {
                errorMsg = `Invalid configuration key "${key}"`;

                break;
            }
        }
    }

    return errorMsg ? new TypeError(errorMsg) : null;
}

// --- some local validation functions ------------------------------

function validateParamDisplayName(displayName) {
    return typeof displayName !== 'string'
        || !displayName.match(REGEX_DISPLAY_NAME) 
        ? 'Parameter "displayName" must be a string matching '
            + REGEX_DISPLAY_NAME
        : null;
}

function validateParamProperties(properties) {
    let ret = null;

    if (properties !== undefined
        && (properties === null || typeof properties !== 'object')) {
        
        ret = 'Parameter "properties" must be an object';
    } else if (Array.isArray(properties)) {
        ret = validateUniqueStringArray(
            properties, 'properties', REGEX_PROPERTY_NAME);
    } else if (properties) {
        for (let propertyName of Object.keys(properties)) {
            if (!propertyName.match(REGEX_PROPERTY_NAME)) {
                ret = 'Invalid property name "${propertyName}"';
            } else if (!properties[propertyName]
                || typeof properties[propertyName] !== 'object') {

                ret = 'Configuration of property "${propertyName}" '
                    + 'must be an object';
            } else {
                const result = validatePropertyConfig(properties[propertyName]);
 
                if (result) {
                    ret = 'Invalid configuration for property '
                        + `"${propertyName}: ${result}`;
                }
            }

            if (ret) {
                break;
            }
        }
    }

    return ret;
}

function validatePropertyConfig(propertyConfig) {
    let ret = null;

    const
        type = propertyConfig.type,
        constraint = propertyConfig.constraint,
        nullable = propertyConfig.nullable,
        getDefaultValue = propertyConfig.getDefaultValue,
        inject = propertyConfig.inject,
        
        typeIsValid = type === undefined || typeof type === 'function',

        constraintIsValid = constraint === undefined
            || typeof constraint === 'function'
            || (constraint && typeof constraint === 'object'
                && typeof constraint.validate === 'function'),

        nullableIsValid = nullable === undefined
            || typeof nullable === 'boolean',

        getDefaultValueIsValid = getDefaultValue === undefined
             || typeof getDefaultValue === 'function',

        injectIsValid = inject === undefined || typeof inject === 'boolean';

    if (!typeIsValid) {
        ret = 'Property parameter "type" must be a function';
    } else if (!constraintIsValid) {
        ret = 'Property parameter "constraint" must either be a function '
            + 'or an object that has a method called "validate"';
    } else if (!nullableIsValid) {
        ret = 'Property parameter "nullable" must be boolean';
    } else if (!getDefaultValueIsValid) {
        ret = 'Property parameter "getDefaultValue" must be a function';
    } else if (!injectIsValid) {
        ret = 'Property parameter "inject" must be boolean';
    } else if (getDefaultValue
        && propertyConfig.hasOwnProperty('defaultValue')) {
        
        ret = 'Property parameter "defaultValue" and "getDefaultValue" '
            + 'must not be configured both at once';
    } else { 
        for (const key of Object.keys(propertyConfig)) {
            if (!VALID_PROPERTY_CONFIG_KEYS.has(key)) {
                ret = `Invalid configuration key "${key}"`;

                break;
            }
        }
    }

    return ret;
}

function validateParamProvides(provides) {
    return validateUniqueStringArray(
        provides, 'provides', REGEX_PROPERTY_NAME);
}

function validateParamOperations(operations) {
    return validateUniqueStringArray(operations, 'operations',
        REGEX_OPERATION_NAME, FORBIDDEN_OPERATION_NAMES);
}

function validateParamActions(actions) {
    let ret = null;

    const entries = Object.entries(actions);
    
    for (let i = 0; i < entries.length; ++i) {
        const [actionName, payloadCreator] = entries[i];

        if (!entries[0].match(REGEX_ACTION_NAME)) {
            ret = `Illegal action name "${actionName}"`;
        } else if (typeof payloadCreator !== 'function') {
            ret = 'Invalid payload creator for action '
                + `"${actionName}"`;
        }

        if (ret) {
            break;
        }
    }


    return ret;
}

function validateUniqueStringArray(it, paramName, regex, forbiddenStrings = null) {
    let ret = null;

    if (it !== undefined) {
        if (!Array.isArray(it)) {
            ret = 'Parameter "${paramName}" must be an array';
        } else {
            for (let i = 0; i < it.length; ++i) {
                if (typeof it[i] !== 'string' || !it[i].match(regex)) {
                    ret = `Parameter "${paramName}[${i}]" must be a string `
                        + `matching ${regex}`;

                    break;
                } else if (forbiddenStrings && forbiddenStrings.has(it[i])) {
                    ret = `Parameter "${paramName}[${i}]" is forbidden`;

                    break;
                }
            }
        }

        if (!ret && new Set(it).size !== it.length) {
            ret = `Paramter "${paramName}" must not contain duplicate entries`;
        }
    }

    return ret;
}
