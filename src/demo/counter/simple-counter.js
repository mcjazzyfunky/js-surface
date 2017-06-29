import {
    createElement as h,
    defineComponent,
    render,
    Component
} from 'js-surface';


class SimpleCounterComponent extends Component {
    static get displayName() {
        return 'SimpleCounter';
    }

    static get properties() {
        return {
            label: {
                type: String,
                defaultValue: 'Counter:'
            },
            initialValue: {
                type: Number,
                defaultValue: 0
            }
        };
    }

    constructor(props) {
        super(props);

        this.state = { counterValue: props.initialValue };
    }

    incrementCounter(delta) {
        this.state = {
            counterValue: this.state.counterValue + delta
        };
    }

    onWillMount() {
        console.log('onWillMount');
        //alert('onWillMount');
    }

    onDidMount() {
        console.log('onDidMount');
        //alert('onDidMount');
    }

    onWillUpdate() {
        console.log('onWillUpdate');
        //alert('onWillUpdate');
    }

    onDidUpdate() {
        console.log('onDidUpdate');
        //alert('onDidUpdate');
    }

    render() {
        return (
            h('div.simple-counter', { ref: (it, remove) => console.log('ref:>>>>: ', it, remove) },
                h('label.simple-counter-label.btn',
                    this.props.label),
                h('button.simple-counter-decrease-button.btn.btn-default',
                    { onClick: () => this.incrementCounter(-1) },
                    '-'),
                h('div.simple-counter-value.btn',
                    this.state.counterValue),
                h('button.simple-counter-increase-button.btn.btn-default',
                    { onClick: () => this.incrementCounter(1) },
                    '+'))
        );
    }
}


const SimpleCounter = defineComponent(SimpleCounterComponent);

render(SimpleCounter({ initialValue: 100 }), 'main-content');
