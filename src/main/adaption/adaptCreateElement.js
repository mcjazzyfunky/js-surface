export default function adaptCreateElement(createElement, adapterName) {
    if (!(['react', 'react-native', 'react-lite', 'preact', 'inferno', 'vue'])
        .includes(adapterName)) {

        throw new Error("Function 'adaptCreateElement' has to be modified to "
            + `support render engine adapter '${adapterName}'`);
    }

    const
        isReact = adapterName === 'react',
        isReactNative = adapterName === 'react-native',
        isReactLite = adapterName === 'react-lite',
        isPreact = adapterName === 'preact',
        isInferno = adapterName === 'inferno',
        isVue = adapterName === 'vue';

    let ret;

    if (isReactNative || isVue) {
        ret = createElement; // no adaption needed here
    } else if (isReact || isVue) {
        ret = function(...args)  {
            const
                type = args[0],
                props = args[1];

            // TODO - that could be done better!!!
            if (type && type.meta) {
                return type.call(...args);
            }

            // TODO - add logic for vue
            if (isReact && props) {
                if (typeof type === 'string') {
                    if (type === 'label') {
                        if (props.for && props.htmlFor === undefined) {
                            args[1] = Object.assign({}, props);
                            args[1].htmlFor = props.for;
                        }
                    } 

                    if (props && props.innerHTML) {
                        if (args[1] === props) {
                            args[1] = Object.assign({}, props);
                        }

                        args[1].dangerouslySetInnerHTML = props.innerHTML;
                        delete args[1].innerHTML; 
                    }
                }
            }

            return createElement(...args);
        };
    } else {
        ret = function (...args)  {
            let ret;
            
            const
                type = args[0],
                props = args[1];

            // TODO - that could be done better!!!
            if (type && type.meta) {
                return type.call(...args);
            }

            if (args.length > 2) {
                const length = args.length; 
            
                for (let i = 2; i < length; ++i) {
                    const child = args[i];

                    if (child && typeof child !== 'string'
                        && typeof child[Symbol.iterator] === 'function') {
                        
                        args[i] = iterableToArray(child);
                    } 
                }
            }

            // TODO - add logic for label.for / innerHTML etc.
            if (isReactLite) {
                if (props && typeof type === 'string') {
                    if (props.class) {
                        const adjustedProps = Object.assign({}, props);
                        
                        adjustedProps.className = props.class;
                        delete adjustedProps.class;

                        args[1] = adjustedProps;
                    }
                }
            }
            

            ret = createElement(...args);

            return ret;
        };
    }

    return ret;
}

function iterableToArray(iterable) {
    let ret = null;

    if (iterable instanceof Array) {
        const length = iterable.length;

        for (let i = 0; i < length; ++i) {
            const item = iterable[i];
    
            if (item && typeof item === 'object' && typeof item[Symbol.iterator] === 'function') {
                if (ret === null) {
                    ret = Array.from(iterable);
                }

                ret[i] = iterableToArray(item);
            } 
        }

        if (ret === null) {
            ret = iterable;
        }
    } else {
        ret = [];

        for (const item of iterable) {
            if (item && typeof item === 'object' && typeof item[Symbol.iterator] === 'function') {
                ret.push(iterableToArray(item));
            } else {
                ret.push(item);
            }
        } 
    }

    return ret;
}
