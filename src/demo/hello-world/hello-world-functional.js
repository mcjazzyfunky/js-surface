import {
    createElement as h,
    defineFunctionalComponent,
    render
} from 'js-surface';

import { Seq } from 'js-prelude';

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
                Seq.of(1, 4, 9),
                `Hello ${name}!`));
    }
});

render(HelloWorld({ name:  'Joan Doe' }), 'main-content');