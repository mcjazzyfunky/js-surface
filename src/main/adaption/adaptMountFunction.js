export default function adaptMountFunction({ mountFunction, unmountFunction }) {
    return (elem, target) => {
        let ret = null;

        const
            isUnmount = elem === undefined || elem === null,

            targetNode = typeof target !== 'string'
                ? target
                : document.getElementById(target);
        
        if (targetNode) {
            if (isUnmount) {
                unmountFunction(targetNode);
            } else {
                mountFunction(elem, targetNode); // TODO - implement properly

                ret = () => unmountFunction(targetNode);
            }
        }        

        return ret;
    };
}
