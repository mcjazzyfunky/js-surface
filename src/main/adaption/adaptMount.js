export default function adaptMount(mount, isElement) {
    return function (content, target, onWillUnmount = null) {
        if (!isElement(content)) {
            throw new TypeError(
                "[mount] First argument 'content' has to be a valid element");
        } else if (typeof target !== 'string' && (!target || !target.tagName)) {console.log(target)
            throw new TypeError(
                "[mount] Second argument 'target' has to be "
                    + 'a string or a DOM element');
        } else if (onWillUnmount !== null && typeof onWillUnmount !== 'function' ) {
            throw new TypeError(
                "[mount] Third argument 'content' has to be "
                    + 'a callback function (optional)');
        }

        let ret = false;

        const targetNode =
            typeof target === 'string'
                ? document.getElementById(target)
                : target;

        if (targetNode) {
            if (typeof targetNode.__unmount === 'function') {
                targetNode.__unmount();
            }

            targetNode.innerHTML = '<span></span>';
            
            const container = targetNode.firstChild;
            
            let cleanedUp = false;

            const unmount = mount(content, container);
            
            const
                onDOMNodeRemoved = event => {
                    if (event.target === container) {
                        cleanUp();
                    }
                },

                cleanUp = () => {
                    if (!cleanedUp) {
                        try {
                            if (onWillUnmount) {
                                onWillUnmount(targetNode);
                            }
                        } finally {
                            cleanedUp = true;
                            container.removeEventListener('DOMNodeRemoved', onDOMNodeRemoved);
                            unmount();
                            delete targetNode.__unmount;
                            container.innerHTML = '';
                        }
                    }
                };

            container.addEventListener('DOMNodeRemoved', onDOMNodeRemoved, false);
        
            if (typeof unmount !== 'function') {
                throw new Error(
                    '[mount] Return value of wrapped mount function must be a function');
            }

            targetNode[Symbol.for('js-surface:unmount')] = cleanUp;

            ret = true; 
        }

        return ret;
    };
}
