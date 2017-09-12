import {
    createElement as h,
    defineClassComponent,
    render
} from 'js-surface';

const HelloWorld = defineClassComponent({
    displayName: 'HelloWorld',

    properties: {
        name: {
            type: String,
            defaultValue: 'World'
        }
    },

    constructor(props) {
        console.log('constructor', props);
    },

    shouldUpdate() {
        console.log('shouldUpdate');

        return true;
    },

    onWillReceiveProps(...args) {
        console.log('onWillRecieveProps', ...args);
    },

    onWillMount(...args) {
        console.log('onWillMount', ...args);
    },

    onDidMount(...args) {
        console.log('onDidMount', ...args);
    },

    onWillUpdate(...args) {
        console.log('onWillUpdate', ...args);
    },

    onDidUpdate(...args) {
        console.log('onDidUpdate', ...args);
    },

    render() {
        return (
            h('div', `Hello ${this.props.name}!`)
        );
    }
});

render(HelloWorld({ name: 'John Doe' }), 'main-content');