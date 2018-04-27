export default function convertIterablesToArrays(items) {
    let ret = null;

    if (items instanceof Array) {
        for (let i = 0; i < items.length; ++i) {
            const item = items[i];

            if (item && typeof item === 'object'
                && typeof item[Symbol.iterator] === 'function') {
                
                const convertedItem = convertIterablesToArrays(item);

                if  (item === convertedItem) {
                    if (ret !== null) {
                        ret.push(item);
                    }
                } else if (ret === null) {
                    ret = items.slice(0, i);
                    ret.push(convertedItem);
                } else {
                    ret.push(convertedItem);
                }
            } else if (ret !== null) {
                ret.push(item);
            }
        }
    } else if (items && typeof items !== 'string'
        && typeof items[Symbol.iterator] === 'function') {
        
        ret = convertIterablesToArrays(Array.from(items));
    } else {
        ret = [];
    }

    return ret || items;
}
