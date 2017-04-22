import {
    hyperscript as dom,
    defineClassComponent,
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
            ...this.state,
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
            dom('div.simple-counter',
                dom('label.simple-counter-label',
                    this.props.label),
                dom('button.simple-counter-decrease-button',
                    { onClick: () => this.incrementCounter(-1) },
                    '-'),
                dom('label.simple-counter-value',
                    this.state.counterValue),
                dom('button.simple-counter-increase-button',
                    { onClick: () => this.incrementCounter(1) },
                    '+'))
        );
    }
}


const SimpleCounter = defineClassComponent(SimpleCounterComponent);

render(SimpleCounter({ initialValue: 100 }), 'main-content');
