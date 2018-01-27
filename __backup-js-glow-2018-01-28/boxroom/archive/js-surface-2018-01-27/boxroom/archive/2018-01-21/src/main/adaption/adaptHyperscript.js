import parseHyperscript from '../util/parseHyperscript';

const
    hyperscriptCache = {},
    simpleTagMark = {};

export default function adaptHyperscript(
    {
        createElement,
        isElement,
        classAttributeName = 'className',
        attributeAliases = null,
        attributeAliasesByTagName = null,
        optimizeForFirefox = typeof InstallTrigger !== 'undefined' 
    }) {

    let
        attributeAliasesEntries = null,
        attributeAliasesEntriesByTagName = null;

    if (attributeAliases) {
        attributeAliasesEntries = Object.entries(attributeAliases);
    }

    if (attributeAliasesByTagName) {
        attributeAliasesEntriesByTagName = {};

        for (const key of Object.keys(attributeAliasesByTagName)) {
            const entries = Object.entries(attributeAliasesByTagName[key]);

            attributeAliasesEntriesByTagName[key] = entries;
        }
    }

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
                hyperscriptData = parseHyperscript(
                    type, classAttributeName, attributeAliases,
                    attributeAliasesByTagName);
        
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
                    if (offset || args.length === 1) {
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


        // TODO: Optimize this block
        if (tagName && args[1] && (attributeAliases || attributeAliasesByTagName)) {
            let props = args[1];

            if (attributeAliases) {
                for (let i = 0; i < attributeAliasesEntries.length; ++i) {
                    const
                        [key, alias] = attributeAliasesEntries[i],
                        value = props[key];

                    if (value !== undefined) {
                        if (props === args[1]) {
                            props = Object.assign({}, props);
                        }

                        delete props[key];
                        props[alias] = value;
                    }
                }
            }

            if (attributeAliasesByTagName) {
                const entries = attributeAliasesEntriesByTagName[tagName];

                if (entries) {
                    for (let i = 0; i < entries.length; ++i) {
                        const
                            [key, alias] = entries[i],
                            value = props[key];

                        if (value !== undefined) {
                            if (props === args[1]) {
                                props = Object.assign({}, props);
                            }

                            delete props[key];
                            props[alias] = value;
                        }
                    }
                }
            }

            args[1] = props;
        }

        if (!typeIsString && type && type.isComponentFactory) {
            args[0] = type.type;
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
