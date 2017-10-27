import {
    /** @jsx createElement */
    // eslint-disable-next-line no-unused-vars
    createElement,
    defineFunctionalComponent,
    mount
} from 'js-velvet';

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

const HelloWorld = defineFunctionalComponent(
    Object.assign(render, meta));

mount(HelloWorld({ name:  'Joan Doe' }), 'main-content');
