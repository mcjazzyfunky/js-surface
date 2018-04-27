export default function createBinder(getProps, getState, dispatch, eventMappers) {
    return (eventName, param = null) => (...args) => {
        if (typeof eventName !== 'string'
            || !eventMappers.hasOwnProperty(eventName)) {

            throw new Error('[bind] First argument must be a valid event name '
                + 'for the component');
        }


        const result = eventMappers[eventName](...args);

        if (typeof result === 'function') {
            const result2 =
                result({ props: getProps() , state: getState(), param });

            if (result2 !== undefined && result2 !== null) {
                if (typeof result2 !== 'object') {
                    throw new TypeError(
                        'Invalid result of bound event function');
                }

                dispatch(result2);
            }
        } else if (result !== null && typeof result === 'object') {
            dispatch(result);
        } else {
            throw new TypeError(
                'Invalid result of bound event function');
        }
    };
}
