import {
    createElement as h,
    defineComponent,
    render,
    Component
} from 'js-surface';


class HelloWorldComponent extends Component {
    static get displayName() {
        return 'HelloWorld';
    }

    static get properties() {
        return {
            name: {
                type: String,
                defaultValue: 'World'
            }
        };
    }

    constructor(...args) {
        console.log('Constructor', ...args);
        super(...args);
    }

    shouldUpdate() {
        console.log('shouldUpdate');

        return true;
    }

    onWillReceiveProps() {
        console.log('onWillRecieveProps', arguments);
    }

    onWillMount() {
        console.log('onWillMount', arguments);
    }

    onDidMount() {
        console.log('onDidMount', arguments);
    }

    onWillUpdate() {
        console.log('onWillUpdate', arguments);
    }

    onDidUpdate() {
        console.log('onDidUpdate', arguments);
    }

    render() {
        return (
            h('div', { ref: () => alert(1111) } , `Hello ${this.props.name}!`)
        );
    }
}

const HelloWorld = defineComponent(HelloWorldComponent);

render(HelloWorld({ name: 'John Doe' }), 'main-content');