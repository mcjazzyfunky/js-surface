import {
    createElement as h,
    defineComponent,
    mount
} from 'js-surface';

import { Component } from 'js-surface/common/classes';

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

    main: class extends Component {
        constructor(props) {
            super(props);
            this.state = { counterValue: props.initialValue };
        }

        incrementCounter(delta) {
            this.setState({
                counterValue: this.state.counterValue + delta
            });
        }

        componentDidMount() {
            console.log('componentDidMount');
            //alert('componentDidMount');
        }

        componentDidUpdate() {
            console.log('componentDidUpdate');
            //alert('componentDidUpdate');
        }

        componentDidChangeState(prevState) {
            console.log('componentDidChangeState', 'current state', this.state, 'previous state:', prevState);
        }

        shouldComponentUpdate(...args) {
            console.log('should update', 'args:', args);
            return true;
        }

        render() {
            return (
                h('div', { className: 'simple-counter' },
                    h('label', { className: 'simple-counter-label btn' },
                        this.props.label),
                    h('button', {
                        className: 'button simple-counter-decrease-button btn btn-default',
                        onClick: () => this.incrementCounter(-1)
                    },
                        '-'
                    ),
                    h('div', { className: 'simple-counter-value btn' },
                        this.state.counterValue),
                    h('button', {
                        className: 'button simple-counter-increase-button btn btn-default',
                        onClick: () => this.incrementCounter(1) },
                        '+'))
            );
        }
    }
});

mount(SimpleCounter({ label: 'Click counter:' }), 'main-content');
