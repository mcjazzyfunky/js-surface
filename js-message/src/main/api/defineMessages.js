import validateDefineMessagesConfig from
    '../internal/validation/validateDefineMessagesConfig.js';


export default function defineMessages(config) {
    const
        ret = {},
        error = validateDefineMessagesConfig(config);

    if (error) {
        throw error;
    } 

    for (let key of Object.keys(config.messageTypes)) {
        const
            constantName = getConstantName(key),
            constantValue = getMessageType(key, config.namespace);
                    
        ret[constantName] = constantValue;
        ret[key] = createMessageFactory(constantValue, config.messageTypes[key]);
    }

    Object.freeze(ret);

    return ret;
}

// --- internal -----------------------------------------------------

function getMessageType(messageName, namespace) {
    return namespace
        ? `${namespace}:${messageName}`
        : messageName;
}

function getConstantName(messageName) {
    return messageName
        .replace(/([a-z0-9])([A-Z])([a-z0-9])/, '$1_$2$3')
        .toUpperCase();
}

function createMessageFactory(msgType, msgCfg) {
    const
        keys = new Set(Object.keys(msgCfg)),
        defaults = { type: msgType };

    for (let key of keys) {
        const defaultValue = msgCfg[key].defaultValue;

        if (defaultValue !== undefined) {
            defaults[key] =  defaultValue;
        }
    }

    return attrs => {
        const ret = Object.assign({}, defaults);

        for (let key of Object.keys(attrs)) {
            if (!keys.has(key)) {
                throw new Error(`Illegal attribute name '${key}'`);
            }

            ret[key] = attrs[key];
        }

        return ret;
    };
}
