import { parseHyperscript } from '../helper/parseHyperscript';

const
    hyperscriptCache = {},
    simpleTagMark = {};

export default function adaptHyperscript(createElement, isElement) {
    return function (...args) {
        const tag = args[0];

        let ret = null;

        if (typeof tag === 'string') {
            let hyperscriptData = hyperscriptCache[tag];

            if (hyperscriptData === simpleTagMark) {
                ret = applyCreateElement(...args);
            } else if (hyperscriptData) {
                ret = createHyperscriptElement(args, hyperscriptData);
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
                    ret = applyCreateElement(...args);
                } else {
                    hyperscriptCache[tag] = hyperscriptData;
                    ret = createHyperscriptElement(args, hyperscriptData);
                }
            }
        } else {
            ret = applyCreateElement(...args);
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

    function applyCreateElement(...args) {
        let ret = null;

        if (isAttrs(args[1])) {
            ret = createElement(...args);
        } else {
            ret = createElement(args[0], null, ...args.slice(1));
        }

        return ret;
    }

    function createHyperscriptElement(args, hyperscriptData) {
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
                    className = attrs.class,
                    hasProps = isAttrs(args[1]);

                for (let i = 0; i < entries.length; ++i) {
                    const entry = entries[i];
                    attrs2[entry[0]] = entry[1];
                }

                if (hasProps) {
                    Object.assign(attrs2, args[1]);

                    if (className !== attrs2.class) {
                        attrs2.class = `${className} ${attrs2.class}`;
                    }
                }

                const args2 = [tag, attrs2];

                for (let i = (hasProps ? 2 : 1); i < args.length; ++i) {
                    args2.push(args[i]);                    
                }

                currElem = createElement(...args2);
            }
        } 

        return currElem;
    }
}
