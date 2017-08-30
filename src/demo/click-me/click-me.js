import {
    createElement as h,
    defineComponent,
    render
} from 'js-surface';

const ClickMe = defineComponent({
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

    constructor() {
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