import { defineComponent, mount, Html } from 'js-surface';
import { Component } from 'js-surface/common';

const { button } = Html;

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

    main: class extends Component {
        onClick() {
            alert(`You've clicked on "${this.props.text}"`);
        }

        render() {
            return (
                button(
                    { className: 'btn', onClick: this.onClick },
                    this.props.text)
            );
        }
    }
});

mount(ClickMe({ text: 'Click me!' }), 'main-content');
