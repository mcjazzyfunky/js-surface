
import {
    createElement as dom,
    defineFunctionalComponent,
    render
} from 'js-surface';

import {
    defineMessages
} from 'js-message';

import { Spec } from 'js-spec';

const Action = defineMessages({
    messageTypes: {
        addItem: {
            text: {
                type: String
            },
            ddd: {
                defaultValue: 12345
            }
        },
        deleteItem: {
            id: {
                type: Number,
                constraint: "Spec.integer"
            }
        }
    },

    namespacex: 'Module1'
});

console.log(Action);
console.log(Action.addItem({ text: 'xxx' }));

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
            dom('div',
                {className: 'xxx'},
                `Hello ${name}!`));
    }
});

render(HelloWorld({ name:  'Joan Doe' }), 'main-content');