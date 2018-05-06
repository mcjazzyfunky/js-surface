export default function adaptMountFunction({
  mountFunction,
  unmountFunction,
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
        unmountFunction(targetNode);
      } else {
        mountFunction(element, targetNode); // TODO - implement properly

        ret = () => unmountFunction(targetNode);
      }
    }

    return ret;
  };
}
