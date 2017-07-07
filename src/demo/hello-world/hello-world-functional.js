import {
    createElement as h,
    defineFunctionalComponent,
    render
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
            h('div.xxx.yyy > section#my-section.some-class > p[data-xxx=4]',
                { style: { display: 'block' } },
                `Hello ${name}!`));
    }
});

render(HelloWorld({ name:  'Joan Doe' }), 'main-content');
