import {
    hyperscript as h, 
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
                h('b',
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

    methods: ['resetCounter'],

    init(updateView, forwardState) {
        let counterValue;

        const
            setCounterValue = n => {
                counterValue = n;
                forwardState({ counterValue });
            },

            increaseCounter = n => {
                setCounterValue(counterValue + n);
                updateView(render());
            },

            render = () => {
                return (
                    h('span.counter',
                        h('button.btn.btn-default',
                            { onClick: () => increaseCounter(-1) },
                            '-'),
                        h('div',
                            { style: { width: '30px', display: 'inline-block', textAlign: 'center' }},
                            CounterInfo({ value: counterValue })),
                        h('button.btn.btn-default',
                            { onClick: () => increaseCounter(1) },
                            '+'))
                );
            };
       
        setCounterValue(0);

        return {
            setProps() {
                updateView(render());
            },

            applyMethod(name, args) {
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
        setProps() {
            let counterInstance = null;

            updateView(
                h('div.counter-ctrl',
                    h('button.btn.btn-info',
                        { onClick: () => counterInstance.resetCounter(0) },
                        'Set to 0'),
                        ' ',
                        Counter({ ref: it => { counterInstance = it; } }),
                        ' ',
                        h('button.btn.btn-info',
                            { onClick: () => counterInstance.resetCounter(100) },
                            'Set to 100')));
        }
    })
});

mount(CounterCtrl(), 'main-content');

