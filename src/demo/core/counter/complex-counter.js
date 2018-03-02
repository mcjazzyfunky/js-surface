import {
    createElement as h, 
    defineComponent,
    mount 
} from 'js-surface';

import { Spec } from 'js-spec';

const CounterInfo = defineComponent({
    displayName:  'CounterInfo',

    properties: {
        value: {
            type: Number
        }
    },

    render(props) {
        return (
            h('label',
                null,
                h('b',
                    null,
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

    init(updateView, updateState) {
        let counterValue;

        const
            setCounterValue = n => {
                counterValue = n;
                updateState({ counterValue });
            },

            increaseCounter = n => {
                setCounterValue(counterValue + n);
                updateView(render());
            },

            render = () => {
                return (
                    h('span',
                        { className: 'counter' },
                        h('button',
                            {
                                className: 'btn btn-default',
                                onClick: () => increaseCounter(-1)
                            },
                            '-'),
                        h('div',
                            { style: { width: '30px', display: 'inline-block', textAlign: 'center' }},
                            CounterInfo({ value: counterValue })),
                        h('button',
                            {
                                className: 'btn btn-default',
                                onClick: () => increaseCounter(1)
                            }, 
                            '+'))
                );
            };
       
        setCounterValue(0);

        return {
            receiveProps() {
                updateView(render());
            },

            runOperation(name, args) {
                if (name === 'resetCounter') {
                    const [n = 0] = args;

                    counterValue = n;
                    updateView(render());
                }
            }
        };
    }
});

// --------------------------------------------------------------------

const CounterCtrl = defineComponent({
    displayName: 'CounterCtrl',

    init: updateView => ({
        receiveProps() {
            let counterInstance = null;

            updateView(
                h('div',
                    { className: 'counter-ctrl' },
                    h('button',
                        {
                            className: 'btn btn-info',
                            onClick: () => counterInstance.resetCounter(0)
                        },
                        'Set to 0'),
                    ' ',
                    Counter({ ref: it => { counterInstance = it; } }),
                    ' ',
                    h('button',
                        {
                            className: 'btn btn-info',
                            onClick: () => counterInstance.resetCounter(100)
                        },
                        'Set to 100')));
        }
    })
});

mount(CounterCtrl(), 'main-content');

