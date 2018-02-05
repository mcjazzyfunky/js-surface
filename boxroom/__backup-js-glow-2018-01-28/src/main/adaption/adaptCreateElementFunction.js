export default function adaptComponentDecorator({
    createElement 
}) {
    return (...args) => {
        // TODO
        return createElement.apply(null, args);
    };
}
