import {
    createElement as h,
    defineComponent,
    mount,
} from 'js-surface';

import { Component } from 'js-surface/generic/common';
console.log(1, Component)
const HelloWorld = defineComponent({
    displayName: 'HelloWorld',

    properties: {
        name: {
            type: String,
            defaultValue: 'World'
        }
    },

    main: class extends Component {
        constructor(props) {
            super(props);
        }

        render() {
            return (
                h('div', null, `Hello ${this.props.name}!`)
            );
        }
    }
});

mount(HelloWorld({ name: 'John Doe' }), 'main-content');
