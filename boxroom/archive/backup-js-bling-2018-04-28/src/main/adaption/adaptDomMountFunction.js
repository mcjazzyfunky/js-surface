export default function adaptDomMountFunction({
    mount,
    unmount,
    isElement
}) {
    return (element, target) => {
        let ret = null;

        if (element !== null && !isElement(element)) {
            throw new TypeError(
                '[mount] First argument must be a virutal element or null');
        }

        const
            isUnmount = element === null,

            targetNode = typeof target === 'string'
                ? document.getElementById(target)
                : target;

        if (targetNode) {
            if (isUnmount) {
                unmount(targetNode);
            } else {
                mount(element, targetNode); // TODO - implement properly

                ret = () => unmount(targetNode);
            }
        }

        return ret;
    };
}
