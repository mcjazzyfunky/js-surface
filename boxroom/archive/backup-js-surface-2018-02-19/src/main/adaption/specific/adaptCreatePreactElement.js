import convertIterablesToArrays from '../../util/convertIterablesToArrays';

import Preact from 'preact';

const createElement = Preact.h;

export default function adaptCreatePreactElement({
    isFirefox = typeof InstallTrigger !== 'undefined'
}) {
    return isFirefox    
        ? function (...args) {
            args = convertIterablesToArrays(args);

            const firstArg = args[0];

            if (firstArg === null) {
                args[0] = 'x-fragment'; // TODO
            } else if (firstArg && firstArg.__isSurfaceComponentFactory === true) {
                args[0] = firstArg.type;
            }

            return createElement(...args);
        }
        : function (...args) {
            args = convertIterablesToArrays(args);
            
            const firstArg = args[0];

            if (firstArg === null) {
                args[0] = 'x-fragment'; // TODO
            } else if (firstArg && firstArg.__isSurfaceComponentFactory === true) {
                args[0] = firstArg.type;
            }

            return createElement.apply(null, args);
        };
}
