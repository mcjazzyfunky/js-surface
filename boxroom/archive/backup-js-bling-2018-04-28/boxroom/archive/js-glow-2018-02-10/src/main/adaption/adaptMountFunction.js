export default function adaptMountFunction({ mountFunction, unmountFunction }) {
    return (elem, target) => {
        
        const targetNode = typeof target !== 'string'
            ? target
            : document.getElementById(target);
        
        return mountFunction(elem, targetNode); // TODO - implement properly
    };
}
