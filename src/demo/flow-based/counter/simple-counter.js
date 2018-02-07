import { defineComponent, mount, Html } from 'js-surface';
import { defineFlow } from 'js-surface/generic/flow';

const { button, div, label } = Html;

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

    main: defineFlow({
        actions: {
            incrementCounter: delta => ({ delta })
        },

        initState: props => ({ counter: props.initialValue }),

        updateState: {
            incrementCounter: {
                counter: (state, { delta }) => state.counter + delta
            }
        },

        events: actions => ({
            clickIncrement: () => actions.incrementCounter(1),
            clickDecrement: () => actions.incrementCounter(-1)
        }),

        render(props, state, events) {
            return (
                div({ className: 'simple-counter' },
                    label({ className: 'simple-counter-label btn' },
                        props.label),
                    button({
                        className: 'button simple-counter-decrease-button btn btn-default',
                        onClick: events.clickIncrement()
                    },
                        '-'
                    ),
                    div({ className: 'simple-counter-value btn' },
                        state.counterValue),
                    div({ button }, {
                        className: 'button simple-counter-increase-button btn btn-default',
                        onClick: () => events.clickDecrement() },
                        '+'))
            );
        }
    }) 
});

mount(SimpleCounter({ label: 'Click counter:' }), 'main-content');
