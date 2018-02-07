import { defineComponent, mount, Html } from 'js-surface';
import { defineFlow } from 'js-surface/common';
import { Spec } from 'js-spec';

const { b, button, div, label, span } = Html;

const CounterInfo = defineComponent({
    displayName:  'CounterInfo',

    properties: {
        value: {
            type: Number
        }
    },

    render(props) {
        return (
            label(null,
               b(null,
                    props.value)));
    }
});


// --------------------------------------------------------------------

const Counter = defineComponent({
    displayName: 'Counter',

    properties: {
        initialValue: {
            type: Number,
            constraint: Spec.integer,
            defaultValue: 0
        },

        onChange: {
            type: Function,
            nullable: true,
            defaultValue: null
        }
    },

    operations: ['resetCounter'],

    main: defineFlow({
        actions: {
            increaseCounter: ({ delta }) => ({ delta }),
            resetCounter: ({ value }) => ({ value })
        },

        initState: props => ({ counter: props.initialValue }),

        updateState: {
            increaseCounter: {
                counter: ({ delta }, it) => it + delta 
            },

            resetCounter: {
                counter: ({ value }) => ({ counter: value })
            }
        },

        events: actions => ({
            clickIncrement: () => actions.incrementCounter(1),
            clickDecrement: () => actions.incrementCounter(-1)
        }),

        operations: actions => ({
            resetCounter: ([n]) => actions.resetCounter({ value: n })
        }),

        render(props, state, events) {
            return (
                span({ className: 'counter' },
                    button({
                        className: 'btn btn-default',
                        onClick: events.clickDecrement()
                    },
                        '-'),
                    div({
                        style: {
                            width: '30px',
                            display: 'inline-block',
                            textAlign: 'center'
                        }
                    },
                        CounterInfo({ value: state.counter })),
                    button({
                        className: 'btn btn-default',
                        onClick: events.clickIncrement()
                    },
                        '+'))
            );
        }
    })
});

// --------------------------------------------------------------------

const CounterCtrl = defineComponent({
    displayName: 'CounterCtrl',

    render () {
        let counterInstance = null;

        return (
            div({ className: 'counter-ctrl' },
                button({
                    className: 'btn btn-info',
                    onClick: () => counterInstance.resetCounter(0)
                },
                    'Set to 0'),
                ' ',
                Counter({ ref: it => { counterInstance = it; } }),
                ' ',
                button({
                    className: 'btn btn-info',
                    onClick: () => counterInstance.resetCounter(100)
                },
                    'Set to 100')));
    }
});

mount(CounterCtrl(), 'main-content');

