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
        initState: props => ({ counter: props.initialValue }),

        updateState: {
            incrementCounter: {
                counter: ({ delta }, it) => it + delta 
            },

            resetCounter: {
                counter: ({ value }) => value
            }
        },
        
        actions: {
            incrementCounter: delta => ({ delta }),
            resetCounter: value => ({ value })
        },

        events: actions => ({
            clickIncrement: actions.incrementCounter(1),
            clickDecrement: actions.incrementCounter(-1)
        }),

        operations: actions => ({
            resetCounter: ([value]) => actions.resetCounter(value)
        }),

        render(props, state, events) {
            return (
                span({ className: 'counter' },
                    button({
                        className: 'btn btn-default',
                        onClick: events.clickDecrement
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
                        onClick: events.clickIncrement
                    },
                        '+'))
            );
        }
    })
});

// --------------------------------------------------------------------

const CounterCtrl = defineComponent({
    displayName: 'CounterCtrl',

    main: defineFlow({
        actions: {
            // state updates
            setCounterRef: ref => ({ ref }),

            // side effects
            resetCounter: value => (getProps, getState) => {
                const ref = getState().counterRef;

                ref.resetCounter(value);
            }
        },

        initState: () => ({ counterRef: null }),

        updateState: {
            setCounterRef: {
                counterRef: ({ ref }) => ref
            }
        },

        events: actions => ({
            refCounter: ref => actions.setCounterRef(ref),
            clickSetToZero: actions.resetCounter(0),
            clickSetToOneHundred: actions.resetCounter(100)
        }),

        render (props, state, events) {
            return (
                div({ className: 'counter-ctrl' },
                    button({
                        className: 'btn btn-info',
                        onClick: events.clickSetToZero
                    },
                        'Set to 0'),
                    ' ',
                    Counter({ ref: events.refCounter }),
                    ' ',
                    button({
                        className: 'btn btn-info',
                        onClick: events.clickSetToOneHundred
                    },
                        'Set to 100')));
        }
    })
});

mount(CounterCtrl(), 'main-content');
