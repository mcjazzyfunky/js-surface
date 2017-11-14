import parseHyperscript from '../helper/parseHyperscript';

const
    hyperscriptCache = {},
    simpleTagMark = {};

export default function adaptHyperscript(createElement2, isElement, Adapter) {
    const
        isFirefox = typeof InstallTrigger !== 'undefined',
        isReact = Adapter.name === 'react',
        isInferno = Adapter.name === 'inferno',
        isPreact = Adapter.name === 'preact',
        isReactLite = Adapter.name === 'react-lite',
        isVue = Adapter.name === 'vue',
        flattenArgs = !isReact;

    let createElement;

    if (isReact) {
        createElement = Adapter.api.React.createElement;
    } else if (isInferno) {
        createElement = Adapter.api.Inferno.createElement;
    } else if (isPreact) {
        createElement = Adapter.api.Preact.createElement;
    } else if (isReactLite) {
        createElement = Adapter.api.ReactLite.createElement;
    } else if (isVue) {
        //createElement = createElement2;
        createElement = function (/* arguments */) {
            const
                argCount = arguments.length,
                type = arguments[0],
                typeIsFactory = typeof type === 'function' && type.type && type.meta,
                props = argCount > 1 ? arguments[1] : null;

            let children = null;

            if (argCount > 1) {
                children = new Array(argCount);

                for (let i = 2; i < argCount; ++i) {
                    children[i - 2] = arguments[i];
                }

                if (typeIsFactory) {
                    children[0] = props;
                }
            }

            return {
                type: typeIsFactory ? type.type : type,
                props,
                children,
                isSurfaceElement: true
            };
        };
    } else {
        throw new Error(`Unknown component sytem adapter '${Adapter.name}'`);
    }

    return function(/* arguments */) {
        let
            ret,
            tagName = null, // wil possibly be updated later to real tag
            hyperscriptData = null, // will possibly be updated later
            isHyperscript = false; // will possibly be updated later

        const
            tag = arguments[0],
            tagIsString = typeof tag === 'string',
            argCount = arguments.length,
            secondArg = argCount > 1 ? arguments[1] : undefined,
            secondArgIsAttrs = argCount > 1 && isAttrs(secondArg);

        if (tagIsString) {
            hyperscriptData = hyperscriptCache[tag];

            if (!hyperscriptData) {
                hyperscriptData = parseHyperscript(tag);
        
                if (hyperscriptData === null) {
                    throw new Error(
                        "[createElement] First argument 'tag' "
                        + `is not in valid hyperscript format ('${tag}')`);
                }
                    
                if (hyperscriptData.length === 1 && !hyperscriptData[0].attrs) {
                    hyperscriptCache[tag] = simpleTagMark;
                    tagName = tag;
                } else {
                    hyperscriptCache[tag] = hyperscriptData;
                    tagName = hyperscriptData[hyperscriptData.length - 1].tag;
                    isHyperscript = true;
                }
            } else if (hyperscriptData === simpleTagMark) {
                tagName = tag;
            } else {
                tagName = hyperscriptData[hyperscriptData.length - 1].tag;
                isHyperscript = true;
            }
        }

        let args;

        if (!isFirefox
            && !flattenArgs
            && !isHyperscript
            && (tagName && tagName !== tag)
            && (argCount < 2 || secondArgIsAttrs)) {

            args = arguments;
        } else {
            const offset = argCount > 1 && !secondArgIsAttrs ? 1 : 0;

            args = new Array(arguments.length + offset);

            args[0] = tagName ? tagName : tag;

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

        if (isFirefox) {
            ret = createElement(...args);
        } else {
            ret = createElement.apply(null, args);
        }

        if (isHyperscript) {
            const length = hyperscriptData.length;

            for (let i = 1; i < length; ++i) {
                let node = hyperscriptData[length - 1 - i];

                ret = createElement(node.tag, node.attrs, ret);
            }
        }

        return ret;
    };
}

function isAttrs(it) {
    return  it === undefined
        || it === null
        || typeof it === 'object'
            && !it[Symbol.iterator]
           // && !isElement(it); // TODO
}
