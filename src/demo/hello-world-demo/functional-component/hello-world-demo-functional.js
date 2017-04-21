import {
    createElement as dom,
    defineFunctionalComponent,
    render
} from 'js-surface';

const HelloWorld = defineFunctionalComponent({
    displayName:  'HelloWorld',

    properties: {
        displayName:  {
            type: String,
            defaultValue: 'World'
        }
    },

    render({ name }) {
        return (
            dom('div',
                null,
                `Hello ${name}!`));
    }
});

render(HelloWorld({ displayName:  'John Doe' }), 'main-content');