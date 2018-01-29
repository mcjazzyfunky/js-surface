import React from 'react';

const createElement = React.createElement;

export default function createReactElement(...args) {
    const firstArg = args[0];
    
    if (firstArg === null) {
        args[0] = React.Fragment;
    } else if (firstArg && firstArg.__isSurfaceComponentFactory === true) {
        args[0] = firstArg.type;
    }

    return createElement(...args);
}
