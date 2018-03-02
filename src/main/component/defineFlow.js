export default function defineFlow(flowConfig) {
    const error = validateFlowConfig(flowConfig);

    if (error) {
        throw new TypeError(
            `[defineFlow] Invalid flow configuration: ${error.message}`);
    }

    const
        actions = buildActionCreators(flowConfig.actions),
        stateReducer = buildStateReducer(flowConfig.updateState);

    return {
        normalizeComponent(componentConfig) {
            let state = undefined;

            let currProps = null, setView, setState;
            
            const dispatch = (action) => {
                if (Array.isArray(action)) {
                    action.forEach(it => dispatch(it));
                } else if (typeof action.payload !== 'function') {
                    const newState = stateReducer(state, action);

                    if (newState !== state) {
                        state = newState;

                        if (lifecycleHandlers.willUpdate) {
                            lifecycleHandlers.willUpdate(/* TODO */);
                        }

                        setView(flowConfig.render(currProps, state, events), setState(newState));
                    }
                } else {
                    // TODO - use middleware => initMiddleware(...)
                    action.payload(() => currProps, () => state);
                }
            };

            const events = buildEventHandlerCreators(flowConfig.events, actions, dispatch);
            const lifecycleHandlers = buildLifecycleHandlers(flowConfig.lifecycle, actions, dispatch);
            const operationsToEvents = flowConfig.operations ? flowConfig.operations(actions) : null;

        
            const init = (updateView, updateState) => {
                setView = updateView;
                setState = updateState;

                const ret = {
                    receiveProps(props) {
                        const initialized = state !== undefined;

                        currProps = props;

                        if (!initialized) {
                            state = flowConfig.initState
                                ? flowConfig.initState(props) || null
                                : null;
                            
                            if (lifecycleHandlers.willMount) {
                                lifecycleHandlers.willMount(/* TODO */);
                            }
                        } else {
                            if (lifecycleHandlers.willUpdate) {
                                lifecycleHandlers.willUpdate(/* TODO */);
                            }
                        }

                        updateView(flowConfig.render(props, state, events));
                    },

                    finalize() {
                    }
                };

                if (operationsToEvents) {
                    ret.runOperation = (name, args) => {
                        const func = operationsToEvents[name];

                        if (typeof func === 'function') {
                            dispatch(func(args));
                        }
                    };
                }

                return ret;
            };

            return { init };
        }
    };
}

function buildActionCreators(actionsConfig) {
    const ret = {};

    for (const key of Object.keys(actionsConfig)) {
        ret[key] = (...args) => ({
            type: key,
            payload: actionsConfig[key](...args)
        });
    }

    return ret;
}

function buildStateReducer(updateStateConfig) {
    const updatesByActionType = {};

    for (const actionType of Object.keys(updateStateConfig)) {
        const updatesByKey = updateStateConfig[actionType];

        updatesByActionType[actionType] = (state, payload) => {
            const ret = {};

            for (const key of Object.keys(updatesByKey)) {
                ret[key] = updatesByKey[key](payload, state[key], state);
            }

            return ret;
        };
    }

    return (state, { type, payload }) => {
        const update = updatesByActionType[type];

        return update ? update(state, payload) : state;
    };
}

function buildEventHandlerCreators(eventsInitializer, actions, dispatch) {
    const ret = {};

    const e = eventsInitializer(actions);

    for (const key of Object.keys(e)) {

        if (typeof e[key] !== 'function') {
            const callback = () => {
                dispatch(e[key]);
            };

            ret[key] = callback;
        } else {
            ret[key] = (...args) => {
                const result = e[key](...args);

                if (typeof result === 'function') {
                    return (...args2) => {
                        dispatch(result(...args2));
                    };
                } else {
                    dispatch(result);
                }
            };
        }
    }

    return ret;
}

function buildLifecycleHandlers(lifecylceConfig, actions, dispatch) {
    const
        ret = {},
        obj = lifecylceConfig ? lifecylceConfig(actions) : {},
        keys = Object.keys(obj);

    for (let i = 0; i < keys.length; ++i) {
        const key = keys[i];

        ret[key] = (...args) => {
            dispatch(obj[key](...args));
        };
    }

    return ret;
}

function validateFlowConfig(config) {
    return null; // TODO
}
