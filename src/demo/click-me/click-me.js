import {
    hyperscript as h,
    defineClassComponent,
    mount 
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


mount(ClickMe({ text: 'Click me!' }), 'main-content');