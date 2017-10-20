import {
    hyperscript as h,
    defineFunctionalComponent,
    defineClassComponent,
    mount,
    Component
} from 'js-unity';

import PropTypes from 'prop-types';

/*
const meta = {
    displayName: 'MyClassCompnent',

    properties: {
        name: {
            type: String,
            defaultValue: 'Hallo'
        }
    }
};

class HelloWord extends Component {
    componentWillMount(...args) {
        console.log('willMount', ...args);
    }

    componentDidMlount(...args) {
        console.log('didMount', ...args);
    }

    render() {
        return h('div',
            'Hello ',
            this.props.name,
            '!');
    }
}

const HelloWorld = defineComponent(HelloWorld, meta);

*/
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

mount(HelloWorld({ name: 'John Doe'  }), 'main-content');
