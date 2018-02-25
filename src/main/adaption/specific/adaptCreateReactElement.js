import React from 'react';

const
    createElement = React.createElement,

    isV8Engine = typeof process !== 'undefined'
        || (typeof chrome !== 'undefined'
            && window.chrome && window.chrome.webstore);

export default function adaptCreateReactElement({
    optimizeForV8 = isV8Engine
}) {
    return !optimizeForV8    
        ? function (...args) {
            const firstArg = args[0];

            if (firstArg === null) {
                args[0] = React.Fragment;
            } else if (firstArg && firstArg.__isSurfaceComponentFactory === true) {
                args[0] = firstArg.type;
            }

            return createElement(...args);
        }
        : function () {
            const
                args = arguments,
                firstArg = args[0];
            
            if (firstArg === null) {
                args[0] = React.Fragment;
            } else if (firstArg && firstArg.__isSurfaceComponentFactory === true) {
                args[0] = firstArg.type;
            }

            return createElement.apply(null, args);
        };
}
