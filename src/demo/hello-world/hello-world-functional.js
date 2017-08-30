import {
    createElement as h,
    defineComponent,
    render
} from 'js-surface';

const HelloWorld = defineComponent({
    displayName:  'HelloWorld',

    properties: {
        name:  {
            type: String,
            defaultValue: 'World'
        }
    },

    render({ name }) {
        return (
            h('div',
                { style: { display: 'block' } },
                `Hello ${name}!`));
    }
});

render(HelloWorld({ name:  'Joan Doe' }), 'main-content');
