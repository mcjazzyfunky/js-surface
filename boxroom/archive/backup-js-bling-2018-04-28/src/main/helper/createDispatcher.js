export default function createDispatcher(
    getProps, getState, setState, updateState, initMiddleware) { 
    
    const
        middleware =
            initMiddleware === 'function'
                ? initMiddleware()
                : initMiddleware || null,
        
        middlewareArg = Object.freeze({
            get props() {
                return getProps(); 
            },

            get state() {
                return getState();
            },

            getProps,
            getState,
            dispatch
        }),
        
        dummyNextMiddleware = () => {};
    
    function dispatch(event) {
        if (Array.isArray(event)) {
            for (let i = 0; i < event.length; ++i) {
                dispatch(event[i]);
            }
        } else if (event) {
            if (typeof event === 'object' && updateState) {
                const
                    state = getState(),
                    nextState = updateState(getState(), event);

                if (nextState !== state) {
                    setState(nextState);
                }
            }

            if (middleware) {
                middleware(middlewareArg)(dummyNextMiddleware)(event);
            }
        }
    }

    return dispatch;
}
