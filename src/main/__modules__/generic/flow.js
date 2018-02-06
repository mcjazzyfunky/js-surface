export {
    defineFlow
};


function defineFlow(flowConfig) {
    const error = validateFlowConfig(flowConfig);

    if (error) {
        throw new TypeError(
            `[defineFlow] Invalid flow configuration: ${error.message}`);
    }

    const
        actions = buildActionCreators(flowConfig.actions),
        stateReducer = buildStateReducer(flowConfig.updateState),
        events = buildEventHandlersCreator(flowConfig.events);

    return {
        normalizeComponent(componentConfig) {
            let state = undefined;
            
            return (updateView, updateState) => {


                return {
                    setProps(props) {
                        if (state === undefined) {
                            state = flowConfig.initState
                                ? flowConfig.initState(props) || null
                                : null;
                        }
console.log(props)
                        updateView(flowConfig.render({ props, state, events }));
                    },

                    close() {
                    }
                };
            };
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
    return (state, { type, payload }) => {
        let ret = state;

        const updater = updateStateConfig[type];
        
        if (typeof updater === 'function') {
            ret = updater(state);
        } else {
            for (const key of Object.keys(updater)) {
                if (ret === state) {
                    ret = { ...state };
                }

                ret[key] = updater[key](state, payload);
            }
        }

        return ret;
    };
}

function buildEventHandlersCreator(events) {
    const ret = {};

    for (const key of Object.keys(events)) {
        ret[key] = () => () => {};
    }
console.log(ret)
    return ret;
}

function validateFlowConfig(config) {
    return null;
}

