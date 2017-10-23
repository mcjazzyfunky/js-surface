export default function warn(...args) {
    if (console && typeof console === 'object'
        && typeof console.error === 'function') {

        console.error(...args);
    }
}
