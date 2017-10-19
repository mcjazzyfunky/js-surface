const
    tagPattern = '^[a-zA-Z][a-zA-Z0-9_-]*',
    idPattern = '#[a-zA-Z][a-zA-Z0-9_-]*',
    classPattern = '\\.[a-zA-Z][a-zA-Z0-9_-]*',
    attrValuePattern = '([a-zA-Z0-9_-]*|"[^">\\\\]*"|\'[^\'>\\\\]*\')',
    attrPattern =  `\\[[a-z][a-zA-Z-]*(=${attrValuePattern})?\\]`,
    elementPattern = `(${tagPattern}|${idPattern}|${classPattern}|${attrPattern})`,
    elementRegex = new RegExp(elementPattern, 'g');

export function parseHyperscript(hyperscript) {
    const items =
        hyperscript
            .split(/\s*>\s*/)
            .map(tag => tokenize(tag, elementRegex));

    let ret = [];

    for (let item of items) {
        if (item === null) {
            ret = null;
            break;
        }

        let meta = {
            tag: 'div', // div is default if no tag is given
            attrs: null,
        };

        ret.push(meta);

        for (let i = 0; i < item.length; ++i) {
            const it = item[i];
        
            switch (it[0]) {
            case '#': {
                if (meta.attrs && meta.attrs.id) {
                    ret = null;
                    break;
                }

                meta.attrs = meta.attrs || {};
                meta.attrs.id = it.substr(1);
                
                break;
            }
            case '.': {
                const oneClass = it.substr(1);
                
                if (!meta.attrs || !meta.attrs.className) {
                    meta.attrs = meta.attrs || {};
                    meta.attrs.className = oneClass;
                } else {
                    meta.attrs.className += ` ${oneClass}`;
                }

                break;
            }
            case '[': {
                const keyValue = it.substr(1, it.length - 2);
                    
                let key, value, tokens;

                if (keyValue.indexOf('=') === -1) {
                    key = keyValue;
                    value = true;
                } else {
                    [key, ...tokens] = keyValue.split('=');
                    value = tokens.join('=');
                    
                    if (meta.attrs === null) {
                        meta.attrs = {};
                    }

                    if (value[0] === '"' || value[0] === "'") {
                        value = value.substr(1, value.length - 2);
                    }
                }

                // TODO?
                if (key === 'for') {
                    key = 'htmlFor';
                }

                if (meta.attrs[key] === undefined
                    && key !== 'class'
                    && key !== 'id') {

                    meta.attrs[key] = value;
                } else {
                    ret = null;
                }
            
                break;
            }
            default: 
                meta.tag = it;
            }

            if (ret === null) {
                break;
            }
        }

        if (meta) {
            meta.entries =
                meta.attrs
                ? Object.entries(meta.attrs)
                : [];
        }

        if (ret === null) {
            break;
        }    
    }

    if (ret !== null && ret.length === 0) {
        ret = null;
    }

    return ret;
}


function tokenize(str, regex) {
    let ret = null;
  
    if (str !== '') {
        const arr = [];
  
        const rest = str.replace(regex, key => {
            arr.push(key);
      
            return '';  
        });

        if (rest === '') {
            ret = arr;
        }
    }
  
    return ret;
}
