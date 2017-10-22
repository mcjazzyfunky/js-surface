import {
    hyperscript as h,
    defineFunctionalComponent,
    mount,

    /** @jsx createElement */
    // eslint-disable-next-line no-unused-vars
    createElement 
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
        <div style={{ display: 'block' }}>
             Hello { name }
        </div>
    );
}

const HelloWorld = defineFunctionalComponent(render, meta);

mount(HelloWorld({ name:  'Joan Doe' }), 'main-content');
