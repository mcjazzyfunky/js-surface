import parseHyperscript from './parseHyperscript';

const
    hyperscriptCache = {},
    simpleTagMark = {};

export default function adaptCreateElement(
    {
        createElement,
        isElement,
        flattenArgs = false,
        optimizeForFirefox = typeof InstallTrigger !== 'undefined' 
    }) {

    return function(/* arguments */) {
        let
            ret,
            tagName = null, // wil possibly be updated later to real tag
            hyperscriptData = null, // will possibly be updated later
            isHyperscript = false; // will possibly be updated later

        const
            type = arguments[0],
            typeIsString = typeof type === 'string',
            argCount = arguments.length,
            secondArg = argCount > 1 ? arguments[1] : undefined,

            secondArgIsProps =
                argCount > 1
                    && secondArg === undefined
                        || secondArg === null
                        || typeof secondArg === 'object'
                            && !secondArg[Symbol.iterator]
                            && !isElement(secondArg);

        if (typeIsString) {
            hyperscriptData = hyperscriptCache[type];

            if (!hyperscriptData) {
                hyperscriptData = parseHyperscript(type);
        
                if (hyperscriptData === null) {
                    throw new Error(
                        "[createElement] First argument 'tag' "
                        + `is not in valid hyperscript format ('${type}')`);
                }
                    
                if (hyperscriptData.length === 1 && !hyperscriptData[0].attrs) {
                    hyperscriptCache[type] = simpleTagMark;
                    tagName = type;
                } else {
                    hyperscriptCache[type] = hyperscriptData;
                    tagName = hyperscriptData[hyperscriptData.length - 1].tag;
                    isHyperscript = true;
                }
            } else if (hyperscriptData === simpleTagMark) {
                tagName = type;
            } else {
                tagName = hyperscriptData[hyperscriptData.length - 1].tag;
                isHyperscript = true;
            }
        }

        let args;

        if (!optimizeForFirefox
            && !flattenArgs
            && !isHyperscript
            && (tagName && tagName !== type)
            && (argCount < 2 || secondArgIsProps)) {

            args = arguments;
        } else {
            const offset = argCount > 1 && !secondArgIsProps ? 1 : 0;

            args = new Array(arguments.length + offset);

            args[0] = tagName ? tagName : type;

            for (let i = 1; i < arguments.length; ++i) {
                args[i + offset] = arguments[i];
            }

            if (offset) {
                args[1] = null;
            }

            if (isHyperscript) {
                const
                    data = hyperscriptData[hyperscriptData.length - 1],
                    entries = data.entries;

                if (entries) {
                    if (offset) {
                        args[1] = data.attrs; 
                    } else {
                        for (let i = 0; i < entries.length; ++i) {
                            const entry = entries[i];

                            args[1][entry[0]] = entry[1];
                        }
                    }
                }
            }
        }

        if (optimizeForFirefox) {
            ret = createElement(...args);
        } else {
            ret = createElement.apply(null, args);
        }

        if (isHyperscript) {
            const hyperscriptDataLength = hyperscriptData.length;

            for (let i = 1; i < hyperscriptDataLength; ++i) {
                let node = hyperscriptData[hyperscriptDataLength - 1 - i];

                ret = createElement(node.tag, node.attrs, ret);
            }
        }

        return ret;
    };
}
