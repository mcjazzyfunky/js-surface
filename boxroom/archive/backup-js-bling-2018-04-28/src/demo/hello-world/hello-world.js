import { createElement as h, defineComponent, mount } from 'js-bling';

const HelloWorld = defineComponent({
    displayName:  'HelloWorld',

    properties: {
        name:  {
            type: String,
            defaultValue: 'World'
        }
    },

    render({ props }) {
        return (
            h('div', { style: { display: 'block' } },
                `Hello ${props.name}!`)
        );
    }
});

const content =
    h('div', null,
        HelloWorld(),
        HelloWorld({ name:  'Joan Doe' }));

mount(content, 'main-content');
