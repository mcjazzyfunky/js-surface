import {
    createElement as h,
    defineClassComponent,
    defineFunctionalComponent,
    mount
} from 'js-glow';

import { Spec } from 'js-spec';

const CounterInfo = defineFunctionalComponent({
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

const Counter = defineClassComponent({
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

    publicMethods: ['resetCounter'],

    constructor() {
        this.state = { counterValue: this.props.initialValue };
    },

    increaseCounter(delta) {
        this.state = { counterValue: this.state.counterValue + delta };
    },

    shouldUpdate() {
        console.log('[shouldUpdate]', arguments);
        return true;
    },

    onWillReceiveProps(nextProps) {
        console.log('[onWillReceiveProps]', arguments);
    },

    onWillChangeState(nextState) {
        console.log('[onWillChangeState]', arguments);
    },

    onDidChangeState(prevState) {
        console.log('[onDidChangeState]', arguments);

        if (this.props.onChange) {
            this.props.onChange({
                type: 'change',
                value: this.state.counterValue
            });
        }
    },

    onWillMount() {
        console.log('[onWillMount]', arguments);
    },

    onDidMount() {
        console.log('[onDidMount]', arguments);
    },

    onWillUpdate() {
        console.log('[onWillUpdate]', arguments);
    },

    onDidUpdate() {
        console.log('[onDidUpdate]', arguments);
    },

    onWillUnmount() {
        console.log('[onWillUnmount]:', arguments);
    },

    resetCounter(value = 0) {
        this.state = { counterValue: value };
    },

    render() {
        return (
            h('span.counter',
                h('button.btn.btn-default',
                    { onClick: () => this.increaseCounter(-1) },
                    '-'),
                h('div',
                    { style: { width: '30px', display: 'inline-block', textAlign: 'center' }},
                    CounterInfo({ value: this.state.counterValue })),
                h('button.btn.btn-default',
                    { onClick: () => this.increaseCounter(1) },
                    '+'))
        );
    }
});

// --------------------------------------------------------------------

const CounterCtrl = defineClassComponent({
    displayName: 'CounterCtrl',

    render() {
        let counterInstance = null;

        return (
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
});

mount(CounterCtrl(), 'main-content');

