import {
    createElement as h, 
    defineClassComponent,
    defineFunctionalComponent,
    render,
    Component
} from 'js-surface';

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

class CounterComponent extends Component {
    static get displayName() {
        return 'Counter';
    }

    static get properties() {
        return {
            initialValue: {
                type: Number,
                defaultValue: 0
            },
            onChange: {
                type: Function,
                defaultValue: null
            }
        };
    }

    static get api() {
        return {
            resetCounter(value = 0) {
                this.state = { counterValue: value };
            }
        };
    }

    constructor(props) {
        super(props);
        this.state = { counterValue: this.props.initialValue };
    }

    increaseCounter(delta) {
        this.state = { counterValue: this.state.counterValue + delta };
    }

    shouldUpdate() {
        console.log('[needsUpdate]', arguments);
        return true;
    }

    onWillReceiveProps(nextProps) {
        console.log('[onWillReceiveProps]', arguments);
    }

    onWillChangeState(nextState) {
        console.log('[onWillChangeState]', arguments);
    }

    onDidChangeState(prevState) {
        console.log('[onDidChangeState]', arguments);

        if (this.props.onChange) {
            this.props.onChange({
                type: 'change',
                value: this.state.counterValue
            });
        }
    }

    onWillMount() {
        console.log('[onWillMount]', arguments);
    }

    onDidMount() {
        console.log('[onDidMount]', arguments);
    }

    onWillUpdate() {
        console.log('[onWillUpdate]', arguments);
    }

    onDidUpdate() {
        console.log('[onDidUpdate]', arguments);
    }

    onWillUnmount() {
        console.log('[onWillUnmount]:', arguments);
    }

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
}

const Counter = defineClassComponent(CounterComponent);

// --------------------------------------------------------------------

const CounterCtrl = defineFunctionalComponent({
    displayName:  'CounterCtrl',

    render() {
        let counterInstance = null;

        return (
            h('div',
                { className: 'counter-ctrl' },
                h('button.btn.btn-info',
                    { onClick: () => counterInstance.resetCounter(0) },
                    'Reset to 0'),
                    ' ',
                    Counter({ ref: it => counterInstance = it }),
                    ' ',
                    h('button.btn.btn-info',
                        { onClick: () => counterInstance.resetCounter(100) },
                        'Reset to 100')));
    }
});

render(CounterCtrl(), 'main-content');

