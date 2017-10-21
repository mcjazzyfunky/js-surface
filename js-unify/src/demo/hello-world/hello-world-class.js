import {
    hyperscript as h,
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

    shouldComponentUpdate() {
        console.log('shouldComponentUpdate');

        return true;
    }

    componentWillReceiveProps(...args) {
        console.log('onWillRecieveProps', ...args);
    }

    componentWillMount(...args) {
        console.log('onWillMount', ...args);
    }

    componentDidMount(...args) {
        console.log('onDidMount', ...args);
    }

    componentWillUpdate(...args) {
        console.log('onWillUpdate', ...args);
    }

    componentDidUpdate(...args) {
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