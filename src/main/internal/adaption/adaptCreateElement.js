const
    tagPattern = '[a-zA-Z][a-zA-Z0-9_-]*',
    idPattern = '(#[a-zA-Z][a-zA-Z0-9_-]*)?',
    classPattern = '(\.[a-zA-Z][a-zA-Z0-9_-]*)*',
    attrPattern = '(\[[a-z][a-zA-Z-]*(=[^\[=]+\]*)?\])*', // TODO
    partialPattern = `${tagPattern}${idPattern}${classPattern}${attrPattern}`,
    fullPattern = `^${partialPattern}(\\s*\>\\s*${partialPattern})*$`,

    tagRegex = new RegExp(`^${tagRegex}$`),
    hyperscriptRegex = new RegExp(`${fullPattern}`),

    tagCache = {},
    tagIsSimpleMark = Symbol();

export default function adaptCreateElement(createElement, isElement) {
    return function (tag, ...rest) {
        let ret = null;

        const
            typeOfTag = typeof tag,
            tagIsString = typeOfTag === 'string';

        if (!tagIsString && typeOfTag !== 'function') {
            throw new Error('[createElement] First parameter tag must either be a string or a component function');
        }

        if (!tagIsString) {
            ret = applyCreateElement(tag, ...rest);
        } else {
            let result = tagCache[tag];

            if (result === tagIsSimpleMark) {
                ret = applyCreateElement(tag, ...rest);
            } else if (result === undefined || !tagCache.hasOwnProperty(tag)) {
                if (!tag.match(hyperscriptRegex)) {
                    throw new Error(
                        "[createElement] First argument 'tag' "
                        + `is not a valid hyperscript tag string ('${tag}')`);
                } else if (tag.match(tagRegex)) {
                    tagCache[tag] = tagIsSimpleMark;

                    ret = applyCreateElement(tag, ...rest);
                } else {
                    const parts = tag.split(/\s*>\s*/);

                    result = [];

                    for (let i = 0; i < parts.length; ++i) {
                        const
                            part = parts[i],
                            tagName = part.split(/(#|\.|\[)/, 1)[0],
                            idName = (part.split('#', 2)[1] || '').split(/\.|\[/, 1)[0] || null,
                            className = part.split('[')[0].split('.').slice(1).join(' ') || null,
                            attrs = getAttrs(part.split(/\[|\]\[|]/).slice(1, -1), tagName);

                        result.push([tagName, idName, className, attrs]);
                    }

                    tagCache[tag] = result;
                }
            }

            if (!ret) {
                const
                    lastTriple = result[result.length - 1],
                    lastTag = lastTriple[0],
                    lastId = lastTriple[1],
                    lastClassName = lastTriple[2],
                    lastAttrs = lastTriple[3] ? Object.assign({}, lastTriple[3]) : {},
                    secondArg = arguments[1],

                    secondArgHasAttrs =
                        secondArg === undefined || secondArg === null ||
                        typeof secondArg === 'object' && !secondArg[Symbol.iterator] && !isElement(secondArg),

                    newArgs = [lastTag];

                if (lastId) {
                    lastAttrs.id = lastId;
                }

                if (lastClassName) {
                    lastAttrs.className = lastClassName;
                }

                if (secondArgHasAttrs) {
                    const
                        secondArgClassName = !secondArg ? null : secondArg.className,
                        secondArgClassNameIsString = typeof secondArgClassName === 'string';

                    Object.assign(lastAttrs, secondArg);

                    if (lastClassName) {
                        if (secondArgClassNameIsString && typeof lastAttrs.className === 'string') {
                            lastAttrs.className = (lastClassName + ' ' + lastAttrs.className).trim();
                        } else if (secondArgClassNameIsString) {
                            lastAttrs.className = lastClassName;
                        }
                    }
                
                    newArgs.push(lastAttrs);

                    for (let i = 2; i < arguments.length; ++i) {
                        newArgs.push(arguments[i]);
                    }
                } else {
                    newArgs.push(lastAttrs);
                    
                    for (let i = 1; i < arguments.length; ++i) {
                        newArgs.push(arguments[i]);
                    }
                }

                ret = createElement.apply(null, newArgs);

                for (let i = result.length - 2; i >= 0; --i) {
                    const
                        triple = result[i],
                        attrs = {};

                    if (triple[1]) {
                        attrs.id = triple[1];
                    }

                    if (triple[2]) {
                        attrs.className = triple[2];
                    }

                    ret = createElement(triple[0], attrs, ret);
                }
            }
        }

        return ret;
    };

    function applyCreateElement(tag, ...rest) {
        const snd = rest[0];
    
        return  snd === undefined || snd === null || typeof snd === 'object' && !snd[Symbol.iterator] && !isElement(snd)
            ? createElement(tag, ...rest)
            : createElement(tag, null, ...rest);
    }
}

function getAttrs(items, tagName) {
    let ret = null;

    if (items.length > 0) {
        ret = {};

        for (let item of items) {
            let [key, value = ''] = item.split('=');

            if (value[0] === '"' && value[value.length - 1] === '"'
                || value[0] === "'" && item[value.length - 1] === "'") {

                value = value.substr(1, value.length - 2);
            }

            if (key === 'for' && tagName === 'label') {
                key = 'htmlFor';
            } else if (key === 'autofocus') {
                key = 'autoFocus';
            }

            ret[key] = value;
        }
    }

    return ret;
}