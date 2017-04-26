import {
    createElement as dom,
    defineDispatchComponent,
    render
} from 'js-surface';

const HelloWorld = defineDispatchComponent({
    displayName:  'HelloWorld',

    properties: {
        name:  {
            type: String,
            preset: 'World'
        }
    },

    render({ props }) {
        return dom('div', null, `Hello ${props.name}!`);
    }
});

render(HelloWorld({ name: 'Jane Doe' }), 'main-content');
