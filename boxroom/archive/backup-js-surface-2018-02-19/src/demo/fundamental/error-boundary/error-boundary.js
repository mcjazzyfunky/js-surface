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

    init(updateView) {
        return {
            setProps(props) {
                if (props.errorMessage) {console.log('triggering error...')
                    throw new Error(props.errorMessage);
                } else {
                    const onClick =
                        props.onClick
                            ? () => props.onClick()
                            : null;

                    updateView(
                        h('button',
                            { className: 'btn', onClick },
                            'Trigger error'));
                }
            }
        };
    }
});

const ErrorBoundary = defineComponent({
    displayName: 'ErrorBoundary',

    isErrorBoundary: true,

    init(updateView) {
        const onClick = () => {
            updateView(ErrorTrigger({ errorMessage: 'Simulated error' }));
        };

        return {
            setProps() {
                updateView(ErrorTrigger({ onClick })); 
            },

            handleError(error) {
                const msg = error.message ? error.message : error.toString();

                updateView(h('div', null, 'Catched error: ' + msg));
            }
        };
    }
});

mount(ErrorBoundary(), 'main-content');
