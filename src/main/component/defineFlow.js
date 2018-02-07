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
                const newState = stateReducer(state, action);

                if (newState !== state) {
                    state = newState;
                    setView(flowConfig.render(currProps, state, events), setState(newState));
                }
            };

            const events = buildEventHandlerCreators(flowConfig.events, actions, dispatch);
            
            const init = (updateView, updateState) => {
                setView = updateView;
                setState = updateState;

                return {
                    setProps(props) {
                        currProps = props;

                        if (state === undefined) {
                            state = flowConfig.initState
                                ? flowConfig.initState(props) || null
                                : null;
                        }
                        updateView(flowConfig.render(props, state, events));
                    },

                    close() {
                    }
                };
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
        ret[key] = (...args) => ev => dispatch(e[key](ev, args));
    }

    return ret;
}

function validateFlowConfig(config) {
    return null; // TODO
}
