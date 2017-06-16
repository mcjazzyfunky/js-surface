
import {
    createElement as dom,
    defineFunctionalComponent,
    render
} from 'js-surface';

const HelloWorld = defineFunctionalComponent({
    displayName:  'HelloWorld',

    properties: {
        name:  {
            type: String,
            preset: 'World'
        }
    },

    render({ name }) {
        return (
            dom('div',
                {className: 'xxx'},
                `Hello ${name}!`));
    }
});

render(HelloWorld({ name:  'Joan Doe' }), 'main-content');