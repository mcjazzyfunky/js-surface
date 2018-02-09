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

    init(updateView, updateState) {
        let
            props = null,
            counterValue = null;
        
        const
            updateCounterValue = n => {
                counterValue = n;
                updateView(render());
                updateState(() => ({ counterValue }));
            },
    
            incrementCounter = n => {
                updateCounterValue(counterValue + n);
            },

            render = () => {
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
                            counterValue),
                        h('button',
                            {
                                className: 'simple-counter-increase-button btn btn-default',
                                onClick: () => incrementCounter(1)
                            },
                            '+'))
                );
            };

        return {
            setProps(nextProps) {
                props = nextProps;
                
                if (counterValue === null) {
                    counterValue = props.initialValue;
                    updateState(() => ({ counterValue }));
                }

                updateView(render());
            }
        };
    },
});

mount(SimpleCounter({ initialValue: 100 }), 'main-content');
