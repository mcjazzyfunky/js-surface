import { createElement, isElement } from 'js-surface';

export default hyperscript2;

const
    tagPattern = '[a-zA-Z][a-zA-Z0-9_-]*',
    idPattern = '(#[a-zA-Z][a-zA-Z0-9_-]*)?',
    classPattern = '(\.[a-zA-Z][a-zA-Z0-9_-]*)*',
    partialPattern = `${tagPattern}${idPattern}${classPattern}`,
    fullPattern = `^${partialPattern}(\/${partialPattern})*$`,

    tagRegex = new RegExp(`^${tagRegex}$`),
    hyperscriptRegex = new RegExp(`${fullPattern}`),

	tagCache = {},
    tagIsSimpleMark = Symbol();

function hyperscript(tag, ...rest) {
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
                	"[hyperscript] First argument 'tag' "
                	+ `is not a valid hyperscript tag string ('${tag}')`);
            } else if (tag.match(tagRegex)) {
                tagCache[tag] = tagIsSimpleMark;

                ret = applyCreateElement(tag, ...rest);
            } else {
                const parts = tag.split('/');

                result = [];

                for (let i = 0; i < parts.length; ++i) {
                    const
                        part = parts[i],
                        tagName = part.split(/(#|\.)/, 1)[0],
                        idName = (part.split('#', 2)[1] || '').split('.', 1)[0] || null,
                        className = (part.split('.')).slice(1).join(' ') || null;

                    result.push([tagName, idName, className]);
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
                lastAttrs = {},
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

                if (secondArgClassNameIsString && typeof lastAttrs.className === 'string') {
                    lastAttrs.className = (lastAttrs.className + ' ' + lastClassName).trim();
                } else if (secondArgClassNameIsString) {
                    lastAttrs.className = lastClassName;
                }

                newArgs.push(lastAttrs);

                for (let i = 2; i < arguments.length; ++i) {
                    newArgs.push(arguments[i]);
                }

                ret = createElement.apply(null, newArgs);
            } else {
                for (let i = 1; i < arguments.length; ++i) {
                    newArgs.push(arguments[i]);
                }

                ret = applyCreateElement(...newArgs);
            }

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
}

function applyCreateElement(tag, ...rest) {
   const snd = rest[0];
console.log(snd)
   return  snd === undefined || snd === null || typeof snd === 'object' && !snd[Symbol.iterator] && !isElement(snd)
        ? createElement(tag, snd || null, ...rest)
    	: createElement(tag, null, ...rest);
}

// Just temporary
function hyperscript2(...args) {
    try {
        const ret = hyperscript(...args);
        return ret;
    } catch (e) {
        console.error(e);
        throw e;
    }
}
