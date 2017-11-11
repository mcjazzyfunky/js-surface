import parseHyperscript from '../helper/parseHyperscript';

const
    hyperscriptCache = {},
    simpleTagMark = {};

export default function adaptHyperscript(createElement, isElement, Adapter) {
    const
        isReact = Adapter.name === 'react',
        isInferno = Adapter.name === 'inferno';
    
    return function (/* arguments */) {
        const tag = arguments[0];

        let ret = null;

        if (typeof tag === 'string') {
            let hyperscriptData =
                tag === 'div' || tag === 'span' // Special cases for performance reasons
                    ? simpleTagMark    
                    : hyperscriptCache[tag];

            // Inlined for performance reasons
            if (hyperscriptData === simpleTagMark) {
                const secondArg = arguments[1]; 
                
                let secondArgIsAttrs = secondArg === undefined
                    || secondArg === null
                    || typeof secondArg === 'object'
                        && !secondArg[Symbol.iterator];

                if (secondArg && secondArgIsAttrs) {
                    if (isReact) {
                        secondArgIsAttrs = !secondArg.$$typeof;
                    } else if (isInferno) {
                        secondArgIsAttrs =
                            !secondArg.type || !(secondArg.flags & 3998); // 28: component, 3970: element
                    } else {
                        secondArgIsAttrs = !isElement(secondArg);
                    }
                }

                if (secondArgIsAttrs) {
                    ret = createElement.apply(null, arguments);
                } else {
                    ret = applyCreateElement(arguments);
                }
            } else if (hyperscriptData) {
                ret = createHyperscriptElement(arguments, hyperscriptData);
            } else {
                hyperscriptData = parseHyperscript(tag);

                if (hyperscriptData === null) {
                    throw new Error(
                        "[createElement] First argument 'tag' "
                        + `is not in valid hyperscript format ('${tag}')`);
                }
                
                if (hyperscriptData.length === 1
                    && !hyperscriptData[0].attrs) {

                    hyperscriptCache[tag] = simpleTagMark;
                    ret = applyCreateElement(arguments);
                } else {
                    hyperscriptCache[tag] = hyperscriptData;
                    ret = createHyperscriptElement(arguments, hyperscriptData);
                }
            }
        } else {
            ret = applyCreateElement(arguments);
        }

        return ret;
    };

    function isAttrs(it) {
        return  it === undefined
            || it === null
            || typeof it === 'object'
                && !it[Symbol.iterator]
                && !isElement(it);
    }

    function applyCreateElement(args) {
        let ret = null;

        const
            secondArg = args[1],
            secondArgIsAttrs = isAttrs(secondArg);
            
        if (secondArgIsAttrs) {
            ret = createElement.apply(null, args);
        } else {
            const firstArg = args[0];

            args[0] = null;
            Array.prototype.unshift.call(args, firstArg);
            ret = createElement.apply(null, args);
        }

        return ret;
    }

    function createHyperscriptElement(args, hyperscriptData) {
        const
            argCount = args.length,
            secondArgIsAttrs = argCount > 1 && isAttrs(args[1]),
            dataLength = hyperscriptData.length;
        
        let
            child = null,
            newArgs = null;

        if (argCount > 2) {
            const offset = secondArgIsAttrs ? 0 : 1;

            newArgs = Array(argCount + offset);

            for (let j = 0; j < argCount; ++j) {
                newArgs[j + offset] = args[j];
            }
        }

        for (let i = 0; i < dataLength; ++i) {
            const
                node = hyperscriptData[i],
                entries = node[entries];
            
            let props = null;

            if (i > 0 || !entries || !secondArgIsAttrs) {
                props = node.attrs;
            } else if (entries && entries.length > 0) {
                props = {};
                
                if (entries) {
                    props = {};

                    for (let j = 0; j < node.entries.length; ++j) {
                        const entry = node.entries[j];

                        props[entry[0]] = entry[1];
                    }
                }
            }

            if (i === 0) {
                if (argCount === 1) {
                    child = createElement(node.tag, props); 
                } else if (!secondArgIsAttrs) {
                    if (argCount === 2) {
                        child = createElement(node.tag, props, args[1]);
                    } else {
                        newArgs[0] = node.tag,
                        newArgs[1] = props,

                        child = createElement.apply(null, newArgs);
                    }
                } else {
                    const
                        attrs = args[1],
                        attrsClassName = attrs.className || null;

                    let className =
                        props && props.className
                            ? props.className
                            : null;

                    if (attrsClassName) {
                        if (className) {
                            className = className + ' ' + attrsClassName;
                        } else {
                            className = attrsClassName;
                        }
                    }

                    props = !props
                        ? attrs
                        : Object.assign(props, attrs);

                    if (className) {
                        props.className = className;
                    }

                    newArgs[0] = node.tag;
                    newArgs[1] = props;

                    child = createElement.apply(null, newArgs);
                }
            } else {
                child = createElement(node.tag, props, child);
            }
        }

        return child;
    }

    function createHyperscriptElement2(args, hyperscriptData) {
        let currElem = null;
        
        const dataLength = hyperscriptData.length;

        for (let i = dataLength - 1; i >= 0; --i) {
            const { tag, attrs, entries } = hyperscriptData[i];

            if (i < dataLength - 1) {
                currElem = createElement(tag, attrs, currElem);
            } else {
                const
                   // attrs2 = attrs ? Object.assign({}, attrs) : {},
                    attrs2 = {},
                    className = attrs && attrs.className ? attrs.className : null,
                    hasProps = isAttrs(args[1]);

                // This is faster then Object.assign
                for (let i = 0; i < entries.length; ++i) {
                    const entry = entries[i];
                    attrs2[entry[0]] = entry[1];
                }

                if (hasProps) {
                    Object.assign(attrs2, args[1]);

                    if (className !== attrs2.className) {
                        attrs2.className = `${className} ${attrs2.className}`;
                    }

                    // Modifying args array is ugly but runs faster than other solutions
                    args = Array.from(args); // TODO: Check this for performance
                    args[0] = tag;
                    args[1] = attrs2;

                    currElem = createElement(...args);
                } else {
                    const args2 = [tag, attrs2];

                    for (let i = 1; i < args.length; ++i) {
                        args2.push(args[i]);                    
                    }

                    currElem = createElement(...args2);

/*                    
                    args[0] = tag;
                    args.push(null);

                    const length = args.length;

                    for (let i = 1; i < args.length; ++i) {
                        args[length - i] = args[length - i - 1]; 
                    }

                    args[1] = attrs2;
                    
                    currElem = createElement(...args);
*/
                }
            }
        } 

        return currElem;
    }
}
