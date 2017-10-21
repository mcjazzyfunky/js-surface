import {
    hyperscript as h,
    defineFunctionalComponent,
    mount 
} from 'js-unify';

const meta = {
    displayName:  'HelloWorld',

    properties: {
        name:  {
            type: String,
            defaultValue: 'World'
        }
    },
};

function render({ name }) {
    return (
        h('div',
            { style: { display: 'block' } },
            `Hello ${name}!`));
}

//const HelloWorld = defineFunctionalComponent(render, meta);
const HelloWorld = defineFunctionalComponent(Object.assign({ render }, meta));

mount(HelloWorld({ name:  'Joan Doe' }), 'main-content');
