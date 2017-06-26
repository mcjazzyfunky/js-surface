import {
    createElement as h,
    defineDispatchComponent,
    render
} from 'js-surface';

const HelloWorld = defineDispatchComponent({
    displayName:  'HelloWorld',

    properties: {
        name:  {
            type: String,
            defaultValue: 'World'
        }
    },

    render({ props }) {
        return h('div', null, `Hello ${props.name}!`);
    }
});

render(HelloWorld({ name: 'Jane Doe' }), 'main-content');
