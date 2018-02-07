import { defineComponent, mount, Html } from 'js-surface';
import { defineFlow } from 'js-surface/common';

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
            // state updater
            incrementCounter: delta => ({ delta }),

            // side effects
            log: (...args) => () => {
                console.log(...args);
            }
        },

        initState: props => ({ counter: props.initialValue }),

        updateState: {
            incrementCounter: {
                counter: ({ delta }, it) => it + delta
            }
        },

        lifecycle: actions => ({
            willMount: () => actions.log('componentWillMount'),
            didMount: () => actions.log('componentDidMount'),
            willUpdate: () => actions.log('componentWillUpdate'),
            didUpdate: () => actions.log('componentWillUpdate')
        }),

        events: actions => ({
            clickIncrement: actions.incrementCounter(1),
            clickDecrement: actions.incrementCounter(-1)
        }),

        render(props, state, events) {
            return (
                div({ className: 'simple-counter' },
                    label({ className: 'simple-counter-label btn' },
                        props.label),
                    button({
                        className: 'button simple-counter-decrease-button btn btn-default',
                        onClick: events.clickDecrement()
                    },
                        '-'
                    ),
                    div({ className: 'simple-counter-value btn' },
                        state.counter),
                    button({
                        className: 'button simple-counter-increase-button btn btn-default',
                        onClick: events.clickIncrement() },
                        '+'))
            );
        }
    }) 
});

mount(SimpleCounter({ label: 'Click counter:' }), 'main-content');
