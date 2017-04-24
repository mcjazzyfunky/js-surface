import { isElement } from 'js-surface';

export function isRenderable(it) {
    let ret;

    const type = typeof it;

    if (ret === null || ret === undefined) {
        ret = true;
    } else if (type === 'function') {
        ret = false;
    } else if (type !== 'object') {
        if (it[Symbol.iterator]) {
            ret = true;

            for (const token of it) {
                if (!isRenderable(token)) {
                    ret = false;
                    break;
                }
            }
        } else {
            ret = isElement(it);
        }
    }

    return ret;
}