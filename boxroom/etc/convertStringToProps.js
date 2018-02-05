const
    patternName = '[a-zA-Z][a-zA-Z0-9_-]*',
    patternClass = `\\.${patternName}`,
    patternId = `#${patternName}`,
    patternAttr = `\\[${patternName}(=[a-zA-Z0-9-_.#]*)?\\]`,
    regex = new RegExp(`(${patternClass}|${patternId}|${patternAttr})`, 'g');


const propsCache = {};

export default function convertStringToProps(s) {
    let ret = propsCache.hasOwnProperty(s) ? propsCache[s] : null;

    if (ret === null) {
        const result = convertStringToPropsWithoutCache(s);

        if (result) {
            ret = Object.freeze(result);
            propsCache[result] = ret;
        }
    }

    return ret;
}

function convertStringToPropsWithoutCache(s) {
    let ret = null;

    if (typeof s === 'string' && s.length > 0) {
        const props = {};

        const rest = s.replace(regex, token => {
            let okay = false;
          
            if (token[0] === '.') {
                if (props.className === undefined) {
                    props.className = token.substr(1);
                } else {
                    props.className += token.replace('.', ' ');
                }
              
                okay = true;
            } else if (token[0] === '#') {
                if (props.id === undefined) {
                    props.id = token.substr(1);
                    okay = true;
                }
            } else {
                if (token.indexOf('=') === -1) {
                    const key = token.substr(1, token.length - 2);
                  
                    if (props[key] === undefined) {
                        props[key] = true;  
                        okay = true;
                    }
                } else {
                    const
                        indexOfEqual = token.indexOf('='),
                        key = token.substring(1, indexOfEqual),
                        value = token.substring(indexOfEqual + 1, token.length - 1);
   
                    if (props[key] === undefined) {
                        props[key] = value;
                        okay = true;
                    }
                }
            }
          
            return okay ? '' : token;
        });
        
        if (rest === '') {
            ret = props;
        }
    }
  
    return ret;
}
