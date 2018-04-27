import { createElement as h, defineComponent, mount } from 'js-bling';
import { defineMessages, defineDispatcher } from 'js-messages';

const
    actions = defineMessages({
        showMsg: () => ({
            effect: () => alert('Thank you for clicking the button')
        })
    });

const ClickMe = defineComponent({
    displayName: 'ClickMe',

    properties: {
        text: {
            type: String,
            defaultValue: ''
        },

        onClick: {
            type: Function,
            nullable: true,
            defaultValue: null
        }
    },

    initDispatcher: defineDispatcher(actions),

    events: {
        clickedButton: () => actions.showMsg()
    },

    render({ props, bind }) {
        return (
            h('button.btn', { onClick: bind('clickedButton') },
                props.text)
        );
    }
});

mount(ClickMe({ text: 'Click me!' }), 'main-content');
