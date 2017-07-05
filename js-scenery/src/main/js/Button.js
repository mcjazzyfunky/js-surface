import {
    createElement as h,
    defineFunctionalComponent
} from 'js-surface';

export default defineFunctionalComponent({
    displayName: 'Button',

    properties: {
        text: {
            type: String,
            nullable: true,
            defaultValue: ''
        },

        onClick: {
            type: Function,
            nullable: true,
            defaultValue: null
        }
    },

    render({ text, onClick }) {
        return (
            h('button.btn',
                text)
        );
    }
});
