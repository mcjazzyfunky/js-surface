/*
import { parseHyperscript } from '../helper/parseHyperscript';

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
*/

import { parseHyperscript } from '../helper/parseHyperscript';

const
    hyperscriptCache = {},
    simpleTagMark = {};


export default function adaptCreateElement(createElement, isElement, RenderEngine) {
    const
        isKnownRenderEngine = true,
        isReact = isKnownRenderEngine && RenderEngine.name.startsWith('react'),
        isInferno = isKnownRenderEngine && RenderEngine.name === 'inferno',
        isReactLite = isKnownRenderEngine && RenderEngine.name === 'react-lite',
        ACTION_APPLY_CREATE_ELEMENT = 1,
        ACTION_CREATE_HYPERSCRIPT_ELEMENT = 2;

    let
        action = 0,
        actionArgs = null;


    return function (tag, ...rest) {
        let ret = null;

        if (typeof tag === 'string') {
            let hyperscriptData = hyperscriptCache[tag];

            if (hyperscriptData === simpleTagMark) {
                action = ACTION_APPLY_CREATE_ELEMENT;
                actionArgs = [tag, ...rest];
            } else if (hyperscriptData) {
                action = ACTION_CREATE_HYPERSCRIPT_ELEMENT;
                actionArgs = [tag, rest, hyperscriptData];
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
                    action = ACTION_APPLY_CREATE_ELEMENT;
                    actionArgs = [tag, ...rest];
                } else {
                    hyperscriptCache[tag] = hyperscriptData;
                    action = ACTION_CREATE_HYPERSCRIPT_ELEMENT;
                    actionArgs = [tag, rest, hyperscriptData];
                }
            }
        } else {
            action = ACTION_APPLY_CREATE_ELEMENT;
            actionArgs = [tag, ...rest];
        }

        if (action === ACTION_APPLY_CREATE_ELEMENT) {
            const secondArg = actionArgs[1];
            let secondArgIsAttrs = false; 

            if (secondArg === undefined || secondArg === null) {
                secondArgIsAttrs = true;
            } else if (typeof secondArg !== 'object'
                || secondArg.constructor !== Object
                || secondArg[Symbol.iterator]) {
                
                // secondArgIsAttrs = false;
            } else if (!isKnownRenderEngine) {
                secondArgIsAttrs = !isElement(secondArg);
            } else {
                // Preact elements are instances of VNode,
                // in that case secondArg.constructor !== Object has already mathed
                if (isReact) {
                    secondArgIsAttrs = !secondArg.$$typeof;
                } else if (isInferno) {
                    secondArgIsAttrs = (secondArg.flags & (28 | 3970)) === 0; // 28: component, 3970: element
                } else if (isReactLite) {
                    secondArgIsAttrs = !secondArg.vtype || !secondArg.type;
                } else {
                    secondArgIsAttrs = isAttrs(secondArg);
                }
            }

            if (secondArgIsAttrs) {
                ret = createElement(...actionArgs);
            } else {
                const
                    [head, ...tail] = actionArgs;
                
                ret = createElement(head, null, ...tail);
            }
        } else if (action === ACTION_CREATE_HYPERSCRIPT_ELEMENT) {
            ret = createHyperscriptElement.apply(null, actionArgs);
        } else {
            throw 'This should never happen';
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
