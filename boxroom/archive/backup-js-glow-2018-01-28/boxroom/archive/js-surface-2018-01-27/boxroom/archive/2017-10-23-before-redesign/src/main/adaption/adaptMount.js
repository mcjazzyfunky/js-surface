export default function adaptMount(mount, isElement) {
    return function (content, target) {
        if (!isElement(content)) {
            throw new TypeError(
                "[mount] First argument 'content' has to be a valid element");
        }

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
                        cleanedUp = true;
                        container.removeEventListener('DOMNodeRemoved', onDOMNodeRemoved);
                        unmount();
                        delete targetNode.__unmount;
                        container.innerHTML = '';
                    }
                };

            container.addEventListener('DOMNodeRemoved', onDOMNodeRemoved, false);
        
            if (typeof unmount !== 'function') {
                throw new Error(
                    '[mount] Return value of wrapped mount function must be a function');
            }

            targetNode.__unmount = cleanUp;

            return {
                node: targetNode,
                unmount: cleanUp
            };
        }
    };
}
