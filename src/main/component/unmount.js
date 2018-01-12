export default function unmount(target) {
    let ret = false;

    const
        targetNode = typeof target === 'string'
            ? document.getElementById(target)
            : target;
    
    if (targetNode && targetNode.tagName) {
        const unmountComponent = targetNode[Symbol.for('js-surface:unmount')];

        if (typeof unmountComponent === 'function') {
            unmountComponent();
            ret = true;            
        }
    }
    
    return ret;
}
