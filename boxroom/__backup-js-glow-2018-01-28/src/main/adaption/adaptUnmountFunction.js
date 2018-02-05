export default function adaptUnountFunction({ unmountFunction }) {
    return (target) => {
        
        const targetNode = typeof target !== 'string'
            ? target
            : document.getElementById(target);
        
        return unmountFunction(targetNode); // TODO - implement properly
    };
}