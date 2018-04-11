import {
    createElement as h,
    defineComponent,
    mount
} from 'js-surface';


const SimpleCounter = defineComponent({
    displayName: 'SimpleCounter',

    properties: {
        label: {
            type: String,
            defaultValue: 'Counter:'
        },

        initialValue: {
            type: Number,
            defaultValue: 0
        }
    },

    init(initialProps, refresh, updateState) {
        updateState(() => ({ counterValue: initialProps.initialValue }));
 
        const
            incrementCounter = delta => {
                updateState(state => ({ counterValue: state.counterValue + delta }), () => refresh());
            },

            render = (props, state) => {
                return (
                    h('div',
                        { className: 'simple-counter' },
                        h('label',
                            { className: 'simple-counter-label btn' },
                            props.label),
                        h('button',
                            {
                                className: 'simple-counter-decrease-button btn btn-default',
                                onClick: () => incrementCounter(-1)
                            },
                            '-'),
                        h('div',
                            { className: 'simple-counter-value btn' },
                            state.counterValue),
                        h('button',
                            {
                                className: 'simple-counter-increase-button btn btn-default',
                                onClick: () => incrementCounter(1)
                            },
                            '+'))
                );
            };

        return {
            render
        };
    },
});

mount(SimpleCounter({ initialValue: 100 }), 'main-content');
