import {
    hyperscript as h,
    defineFunctionalComponent,
    defineClassComponent,
    mount,
    Component
} from 'js-unity';

import PropTypes from 'prop-types';


const meta = {
    displayName: 'Clock',

    properties: {
        label: {
            type: String,
            defaultValue: 'Counter:'
        }
    }
};

class CounterClass extends Component {
    constructor(props) {
        super(props);

        this.state = { counter: 0 };
    }

    componentWillMount(...args) {
        console.log('willMount', ...args);
    }

    componentDidMount(...args) {
        console.log('didMount', ...args);
    }

    componentWillUpdate(...args) {
        console.log('willUpdate', ...args);
    }

    componentDidUpdate(...args) {
        console.log('didUpdate', ...args);
    }

    incrementCounter(n = 1) {
        this.setState({ counter: this.state.counter + n });
    }

    render() {
        return h('div',
            this.props.label,
            ' ',
            h('button', { onClick: () => this.incrementCounter(-1) }, '-'),
            this.state.counter, 
            h('button', { onClick: () => this.incrementCounter(1) }, '+'))
    }
}

const Clock = defineClassComponent(CounterClass, meta);


/*
const meta = {
    displayName:  'HelloWorld',

    properties: {
        name:  {
            type: String,
            defaultValue: 'World'
        }
    }
};

function HelloWorldComp({ name }) {
    return (
        h('div',
            { style: { display: 'block' } },
            `Hello ${name}!`));
}

const HelloWorld = defineFunctionalComponent(HelloWorldComp, meta);
*/
mount(Clock({ label: 'Counter:'  }), 'main-content');
