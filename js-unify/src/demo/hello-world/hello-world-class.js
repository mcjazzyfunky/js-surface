
import {
    createElement as h,
    defineClassComponent,
    mount,
    Component 
} from 'js-unify';

const meta = {
    displayName: 'HelloWorld',

    properties: {
        name: {
            type: String,
            defaultValue: 'World'
        }
    },
};

class CustomComponent extends Component {
    constructor(props) {
        super(props);

        console.log('constructor', props);
    }

    shouldUpdate() {
        console.log('shouldUpdate');

        return true;
    }

    onWillReceiveProps(...args) {
        console.log('onWillRecieveProps', ...args);
    }

    onWillMount(...args) {
        console.log('onWillMount', ...args);
    }

    onDidMount(...args) {
        console.log('onDidMount', ...args);
    }

    onWillUpdate(...args) {
        console.log('onWillUpdate', ...args);
    }

    onDidUpdate(...args) {
        console.log('onDidUpdate', ...args);
    }

    render() {
        return (
            h('div', `Hello ${this.props.name}!`)
        );
    }
}

const HelloWorld = defineClassComponent(CustomComponent, meta);

mount(HelloWorld({ name: 'John Doe' }), 'main-content');