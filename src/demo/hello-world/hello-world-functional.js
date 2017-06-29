import {
    createElement as h,
    defineComponent,
    render
} from 'js-surface';

import { Seq } from 'js-prelude';

const HelloWorld = defineComponent({
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
                `Hello ${name}!`));
    }
});

render(HelloWorld({ name:  'Joan Doe' }), 'main-content');