export default function adaptCreateElementFunction({
    createElement: origCreateElement, copyArgs = false
}) {
    let ret;

    if (copyArgs) {
        ret = function createElement(...args) {
            const firstArg = args[0];

            if (firstArg && firstArg.type) {
                args[0] = firstArg.type;
            }

            return origCreateElement(...args);
        };
    } else {
        ret = function createElement(/* arguments */) {
            const firstArg = arguments[0];

            if (firstArg && firstArg.type) {
                arguments[0] = firstArg.type;
            }

            return origCreateElement.apply(null, arguments);
        };
    }

    return ret;
}