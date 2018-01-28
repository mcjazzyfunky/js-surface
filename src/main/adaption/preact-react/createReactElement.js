import React from 'react';

const createElement = React.createElement;

export default function createReactElement(...args) {
    if (args[0] === null) {
        args[0] = React.Fragment;
    }

    return createElement(...args);
}
