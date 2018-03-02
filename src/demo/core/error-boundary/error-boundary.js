import {
    createElement as h,
    defineComponent,
    mount
} from 'js-surface';

const ErrorTrigger = defineComponent({
    displayName: 'ErrorTrigger',

    properties: {
        errorMessage: {
            type: String,
            defaultValue: ''
        },

        onClick: {
            type: Function,
            nullable: true,
            defaultValue: null
        }
    },

    init(initialProps, refresh) {
        return {
            render(props) {
                let ret;

                if (props.errorMessage) {
                    console.log('triggering error...');
                    throw new Error(props.errorMessage);
                } else {
                    const onClick =
                        props.onClick
                            ? () => props.onClick()
                            : null;

                    ret = 
                        h('button',
                            { className: 'btn', onClick },
                            'Trigger error');
                }

                return ret;
            },

            receiveProps() {
                refresh();
            }
        };
    }
});

const ErrorBoundary = defineComponent({
    displayName: 'ErrorBoundary',

    isErrorBoundary: true,

    init(initialProps, refresh) {
        let
            error = null,
            errorMessage = null;

        return {
            render() {
                return error === null
                    ? ErrorTrigger({
                        errorMessage,

                        onClick: () => {
                            errorMessage = 'Simulated error';
                            refresh();
                        }
                    })

                    : h('div', null, 'Simulated error: ' + error.message);
            },

            handleError(thrownError) {
                error = thrownError;
                refresh();
            }
        };
    }
});

mount(ErrorBoundary(), 'main-content');
