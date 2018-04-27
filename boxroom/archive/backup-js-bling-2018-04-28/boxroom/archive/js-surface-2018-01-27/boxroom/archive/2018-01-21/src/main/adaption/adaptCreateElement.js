import parseHyperscript from '../util/parseHyperscript';

const
    hyperscriptCache = {},
    simpleTagMark = {};

export default function adaptCreateElement(
    {
        createElement,
        isElement,
        classAttributeName = 'className',
        attributeAliases = null,
        attributeAliasesByTagName = null,
        argumentsMapper = null
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

    const adaptedCreateElement = (...args) =>  {
        if (argumentsMapper) {
            args = argumentsMapper(args);
        }

        const
            type = args[0],
            typeIsString = typeof type === 'string',
            
            hyperscriptData = typeIsString
                ? (type === 'div' || type === 'span'
                    ? simpleTagMark
                    : hyperscriptCache[type])
                : null,
            
            secondArg = args[1],

            secondArgIsProps =
                secondArg === undefined
                || secondArg === null
                || (typeof secondArg === 'object'
                    && !secondArg[Symbol.iterator]
                    && !isElement(secondArg));
        
        let ret;
       
        if (type && type.isComponentFactory === true) {
            args[0] = type.type;
        }

        if (hyperscriptData === null || hyperscriptData === simpleTagMark) {
            if (secondArgIsProps) {
                if (secondArg && (attributeAliases || attributeAliasesByTagName)) {
                    args[1] = aliasProps(secondArg,
                        type,
                        attributeAliasesEntries,
                        attributeAliasesEntriesByTagName);
                }
                
                ret = createElement.apply(null, args);
            } else {
                const newArgs = [args[0], null];

                for (let i = 1; i < args.length; ++i) {
                    newArgs.push(args[i]);
                }

                ret = createElement.apply(null, newArgs);
            }
        } else if (hyperscriptData === undefined) {
            const data = parseHyperscript(type, classAttributeName,
                attributeAliases, attributeAliasesByTagName); 
            
            if (!data) {
                throw new Error('Invalid hyperscript');
            }

            hyperscriptCache[type] =
                data.length === 1 && data[0].attrs === null
                    ? simpleTagMark
                    : data; 

            ret = adaptedCreateElement.apply(null, args);
        } else {
            const
                hyperscriptDataLength = hyperscriptData.length,
                lastHyperscriptItem = hyperscriptData[hyperscriptDataLength - 1],
                lastHyperscriptAttrs = lastHyperscriptItem.attrs,
                lastHyperscriptEntries = lastHyperscriptItem.entries,
                lastHyperscriptAttrCount = lastHyperscriptEntries.length;

            let attrs = null;

            args[0] = lastHyperscriptItem.tag;

            if (!secondArg || !secondArgIsProps) {
                attrs = lastHyperscriptAttrs;
            } else {
                let props = secondArg;
                        
                if (props && (attributeAliases || attributeAliasesByTagName)) {
                    props = aliasProps(
                        props, args[0],
                        attributeAliasesEntries,
                        attributeAliasesEntriesByTagName);
                }


                if (lastHyperscriptAttrs) {
                    attrs = {};
                
                    for (let i = 0; i < lastHyperscriptAttrCount; ++i) {
                        const entry = lastHyperscriptEntries[i];

                        attrs[entry[0]] = entry[1];
                    }

                    const keys = Object.keys(props);

                    for (let i = 0; i < keys.length; ++i) {
                        let key = keys[i];
                        const value = props[key];
                        attrs[key] = value; 
                    }
                } else {
                    attrs = secondArg;
                }
            }    

            if (secondArgIsProps) {
                args[1] = attrs;
            } else {
                const newArgs = [args[0], attrs];

                for (let i = 1; i < args.length; ++i) {
                    newArgs.push(args[i]);
                }

                args = newArgs;
            }

         
            ret = createElement.apply(null, args);
            

            for (let i = 1; i < hyperscriptDataLength; ++i) {
                let node = hyperscriptData[hyperscriptDataLength - 1 - i];

                ret = createElement(node.tag, node.attrs, ret);
            }
        }

        return ret;
    };

    return adaptedCreateElement;
}

function aliasProps(
    props, tagName,
    attributeAliasesEntries, attributeAliasesEntriesByTagName) {

    let ret = props;

    if (attributeAliasesEntries) {
        for (let i = 0; i < attributeAliasesEntries.length; ++i) {
            const
                [key, alias] = attributeAliasesEntries[i],
                value = props[key];

            if (value !== undefined) {
                if (ret === props) {
                    ret = Object.assign({}, props);
                }

                delete ret[key];
                ret[alias] = value;
            }
        }
    }

    const entries = attributeAliasesEntriesByTagName
        ? attributeAliasesEntriesByTagName[tagName]
        : null;
    
    if (entries) {
        for (let i = 0; i < entries.length; ++i) {
            const
                [key, alias] = entries[i],
                value = ret[key];

            if (value !== undefined) {
                if (ret === props) {
                    ret = Object.assign({}, props);
                }

                delete ret[key];
                ret[alias] = value;
            }
        }
    }

    return ret;
}
