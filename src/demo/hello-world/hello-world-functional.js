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
            h('div',
                h('input.some-class[type=text][placeholder="Please ent whatever?"]'),
                h('div',
                    `Hello ${name}!`)));
    }
});

render(HelloWorld({ name:  'Joan Doe' }), 'main-content');