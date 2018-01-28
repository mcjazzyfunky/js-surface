import convertIterablesToArrays from '../../util/convertIterablesToArrays';

import Preact from 'preact';

export default function createElement(...args) {
    args = convertIterablesToArrays(args);

    if (args[0] === null) {
        args[0] = 'x-fragment'; // TODO
    }

    return Preact.h(...args);
}