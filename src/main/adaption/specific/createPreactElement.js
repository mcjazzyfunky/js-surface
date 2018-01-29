import convertIterablesToArrays from '../../util/convertIterablesToArrays';

import Preact from 'preact';

export default function createElement(...args) {console.log(1111, args)
    args = convertIterablesToArrays(args);

    const firstArg = args[0];

    if (firstArg === null) {
        args[0] = 'x-fragment'; // TODO
    } else if (firstArg && firstArg.__isSurfaceComponentFactory === true) {
        args[0] = firstArg.type;
    }

    return Preact.h(...args);
}