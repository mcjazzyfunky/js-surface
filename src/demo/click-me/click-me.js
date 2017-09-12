import {
    createElement as h,
    defineClassComponent,
    render
} from 'js-surface';

const ClickMe = defineClassComponent({
    displayName: 'ClickMe',

    properties: {
        text: {
            type: String
        },
        onClick: {
            type: Function,
            nullable: true,
            defaultValue: null
        }
    },

    onClick() {
        alert(`You've clicked on "${this.props.text}"`);
    },

    render() {
        return (
            h('button',
                { onClick: this.onClick },
                this.props.text)
        );
    }
});


render(ClickMe({ text: 'Click me!' }), 'main-content');