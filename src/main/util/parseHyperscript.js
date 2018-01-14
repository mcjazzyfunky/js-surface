const
    tagPattern = '^[a-zA-Z][a-zA-Z0-9_-]*',
    idPattern = '#[a-zA-Z][a-zA-Z0-9_-]*',
    classPattern = '\\.[a-zA-Z][a-zA-Z0-9_-]*',
    attrValuePattern = '([a-zA-Z0-9_-]*|"[^">\\\\]*"|\'[^\'>\\\\]*\')',
    attrPattern =  `\\[[a-z][a-zA-Z-]*(=${attrValuePattern})?\\]`,
    elementPattern = `(${tagPattern}|${idPattern}|${classPattern}|${attrPattern})`,
    elementRegex = new RegExp(elementPattern, 'g'),

    forbiddenAttributes = new Set(
        ['id', 'class', 'className', 'innerHTML', 'dangerouslySetInnerHTML']);

export default function parseHyperscript(
    hyperscript,
    classAttributeName = 'className',
    attributeAliases = null,
    attributeAliasesByTagName = null) {

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
                
                if (!meta.attrs || !meta.attrs[classAttributeName]) {
                    meta.attrs = meta.attrs || {};
                    meta.attrs[classAttributeName] = oneClass;
                } else {
                    meta.attrs[classAttributeName] += ` ${oneClass}`;
                }

                break;
            }
            case '[': {
                let
                    [key, ...tokens] = it.substr(1, it.length - 2).split('='),
                    value = tokens ? tokens.join('=') : true;

                if (forbiddenAttributes.has(key)
                    || key === classAttributeName) {

                    ret = null;
                    break;
                }

                if (value[0] === '"' || value[0] === "'") {
                    value = value.substr(1, value.length - 2);
                }

                if (meta.attrs === null) {
                    meta.attrs = {};
                }

                if (attributeAliases) {
                    key = attributeAliases[key] || key;
                }

                if (attributeAliasesByTagName) {
                    const aliases = attributeAliasesByTagName[meta.tag];

                    if (aliases) {
                        key = aliases[key] || key;
                    }
                }

                if (meta.attrs[key] === undefined) {
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
