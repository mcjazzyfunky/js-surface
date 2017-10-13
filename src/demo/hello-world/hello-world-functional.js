import {
    createElement as h,
    defineFunctionalComponent,
    mount 
} from 'js-surface';

const HelloWorld = defineFunctionalComponent({
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

mount(HelloWorld({ name:  'Joan Doe' }), 'main-content');
