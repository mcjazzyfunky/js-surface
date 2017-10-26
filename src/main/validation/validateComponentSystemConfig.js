import { REGEX_ADAPTER_NAME } from '../constant/constants';


const
    validConfigParamNames = new Set([
        'name',
        'api',
        'createElement',
        'isElement',
        'defineComponent',
        'mount',
        'browserBased'
    ]);

export default function validateComponentSystemConfig(config) {
    let errMsg = null;

    if (!config || typeof config !== 'object') {
        throw new Error('Must be an object');
    } 

    const
        name = config.name,
        api = config.api,
        createElement = config.createElement,
        isElement = config.isElement,
        defineComponent = config.defineComponent,
        mount = config.mount;

    if (name === undefined || name === null) {
        errMsg = "Parameter 'name' is missing";
    } else if (typeof name !== 'string' || !name.match(REGEX_ADAPTER_NAME)) {
        errMsg = "Invalid value for parameter 'name'";
    } else if (api === undefined || api === null) {
        errMsg = "Parameter 'api' is missing";
    } else if (typeof api !== 'object') {
        errMsg = "Parameter 'api' must be an object";
    } else if (createElement === undefined || createElement === null) {
        errMsg = "Parameter 'createElement' is missing";
    } else if (typeof createElement !== 'function') {
        errMsg = "Parameter 'createElement' must be a function";
    } else if (isElement === undefined || isElement === null) {
        errMsg = "Parameter 'isElement' is missing";
    } else if (typeof isElement !== 'function') {
        errMsg = "Parameter 'isElement' must be a function";
    } else if (defineComponent === undefined || defineComponent === null) {
        errMsg = "Parameter 'defineComponent' is missing";
    } else if (typeof defineComponent !== 'function') {
        errMsg = "Parameter 'defineComponent' must be a function";
    } else if (mount === undefined || mount === null) {
        errMsg = "Parameter 'mount' is missing";
    } else if (typeof mount !== 'function') {
        errMsg = "Parameter 'mount' must be a function";
    } else {
        for (const key of Object.keys(config)) {
            if (!validConfigParamNames.has(key)) {
                errMsg = `Illegal configuration parameter key '${key}'`;

                break;
            }
        }
    }

    return errMsg === null
        ? null
        : new Error(errMsg);
}
