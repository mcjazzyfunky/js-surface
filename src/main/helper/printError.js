export default function printError(...args) {
    if (typeof console === 'object' && console !== null
        && typeof console.error === 'function') {

        console.error(...args);
    }
}