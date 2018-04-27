import { defineComponent, mount, Html } from 'js-bling'; 
import { defineMessages, deriveReducer } from 'js-messages';

const { button, div } = Html;

const
    triggerActions = defineMessages({
        setErrorMsg: value => () => ({ errorMsg: value })
    }),
    
    triggerEvents = {
        clickButton: () => triggerActions.setErrorMsg('Simuated error')
    };

const ErrorTrigger = defineComponent({ 
    displayName: 'ErrorTrigger',

    initState: () => ({ errorMsg: null }),
    updateState: deriveReducer(triggerActions),

    render({ state, bind }) {
        if (state.errorMsg) {
            throw new Error(state.errorMsg);
        } 
        
        return (
            button({
                className: 'btn',
                onClick: bind(triggerEvents.clickButton)
            },
                'Trigger error'
            ));
    }
});

// ------------------------------------------------------------------

const
    createBoundaryState = () => ({ error: null, errorInfo: 0}), 

    boundaryActions  = defineMessages({
        setError: (error, errorInfo = null) => () =>
            ({ error, errorInfo })
    });

const ErrorBoundary = defineComponent({
    displayName: 'ErrorBoundary',

    initState: createBoundaryState,
    updateState: deriveReducer(boundaryActions),

    lifecycle: {
        didCatch: ({ error }) => boundaryActions.setError(error)
    },

    render({ state }) {
        let ret = null;

        if (!state.error) {
            ret = ErrorTrigger();
        } else {
            ret = div(null, 'Catched error: ' + state.error.message);
        }

        return ret;
    }
});

mount(ErrorBoundary(), 'main-content');
