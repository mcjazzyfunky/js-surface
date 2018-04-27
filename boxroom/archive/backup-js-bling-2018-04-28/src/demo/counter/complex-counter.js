import { createElement as h, defineComponent, mount } from 'js-bling';
import { defineMessages, defineProcess } from 'js-messages';
import { Spec } from 'js-spec';

const CounterInfo = defineComponent({
    displayName:  'CounterInfo',

    properties: {
        value: {
            type: Number
        }
    },

    render({ props }) {
        return (
            h('label', null,
               h(props.value)));
    }
});


// --------------------------------------------------------------------

const
    createCounterState = counter => ({ counter }),

    counterActions = defineMessages({
        incrementCounter: delta => ({
            update: state => ({ ...state, counter: state.counter + delta })
        }),

        setCounter: value => ({
            update: state => ({ ...state, couter: value })
        })
    });

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

    init: defineProcess(counterActions, createCounterState),

    operations: actions => ({
        resetCounter: (value = 0) => actions.setCounter(value)
    }),
    
    counterEvents: {
        incrementCounter: counterActions.incrementCounter(1),
        decrementCounter: counterActions.incrementCounter(-1)
    },

    render({ state, bind }) {
        return (
            h('span.counter',
                h('button-btn.btn-default',
                    { onClick: bind('decrementCounter') },
                    '-'),
                h('div', {
                    style: {
                        width: '30px',
                        display: 'inline-block',
                        textAlign: 'center'
                    }
                },
                    CounterInfo({ value: state.counter })),
                h('button.btn.btn-default',
                    { onClick: bind('incrementCounter') },
                    '+'
                ))
        );
    }
});

// --------------------------------------------------------------------

const
    createCounterCtrlState = () => ({ counterRef: null }),

    counterCtrlActions = defineMessages({
        updates: {
            setCounterRef: ref => () => ({ counterRef: ref })
        },

        effects: {
            resetCounter: value => self => {
                self.state.ref.resetCounter(value);
            }
        }
    });

const CounterCtrl = defineComponent({
    displayName: 'CounterCtrl',

    init: defineProcess(counterCtrlActions, createCounterCtrlState),

    events: {
        refCounter: ref => counterCtrlActions.setCounterRef(ref),
        resetCounter: () => ({ param }) => counterCtrlActions.resetCounter(param)
    },

    render({ bind }) {
        return (
            h('div.counter-ctrl',
                h('button.btn.btn-info',
                    { onClick: bind('resetCounter', 0) },
                    'Set to 0'
                ),
                ' ',
                Counter({ ref: bind('refCounter') }),
                ' ',
                h('button.btn.btn-info',
                    { onClick: bind('resetCounter', 100) },
                    'Set to 100'
                )));
    }
});

mount(CounterCtrl(), 'main-content');

