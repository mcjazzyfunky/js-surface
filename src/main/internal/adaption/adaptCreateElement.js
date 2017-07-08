import { parseHyperscript } from '../helper/parseHyperscript.js';

const
    hyperscriptCache = {},
    simpleTagMark = {};

export default function adaptCreateElement(createElement, isElement) {
    return function (tag, ...rest) {
        let ret = null;

        if (typeof tag === 'string') {
            let hyperscriptData = hyperscriptCache[tag];

            if (hyperscriptData === simpleTagMark) {
                ret = applyCreateElement(tag, ...rest);
            } else if (hyperscriptData) {
                ret = createHyperscriptElement(tag, rest, hyperscriptData);
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
                    ret = applyCreateElement(tag, ...rest);
                } else {
                    hyperscriptCache[tag] = hyperscriptData;
                    ret = createHyperscriptElement(tag, rest, hyperscriptData);
                }
            }
        } else {
            ret = applyCreateElement(tag, ...rest);
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

    function applyCreateElement(tag, ...rest) {
        return isAttrs(rest[0]) 
            ? createElement(tag, ...rest)
            : createElement(tag, null, ...rest);
    }

    function createHyperscriptElement(tag, rest, hyperscriptData) {
        let currElem = null;
        const dataLength = hyperscriptData.length;

        for (let i = dataLength - 1; i >= 0; --i) {
            const { tag, attrs } = hyperscriptData[i];

            if (i < dataLength - 1) {
                currElem = createElement(tag, attrs, currElem);
            } else {
                const
                    attrs2 = attrs ? Object.assign({}, attrs) : {},
                    className = attrs2.className;

                if (isAttrs(rest[0])) {
                    Object.assign(attrs2, rest[0]);

                    if (className !== attrs2.className) {
                        attrs2.className = `${className} ${attrs2.className}`;
                    }

                    currElem = createElement(tag, attrs2, ...rest.slice(1));
                } else {
                    currElem = createElement(tag, attrs2, ...rest); 
                }
            }
        } 

        return currElem;
    }
}
