import {
    createElement as h,
    defineComponent,
    mount
} from 'js-surface';

const HelloWorld = defineComponent({
    displayName:  'HelloWorld',

    properties: {
        name:  {
            type: String,
            defaultValue: 'World'
        }
    },

    init(updateView) {
        return {
            setProps(props) {
                updateView(
                    h('div',
                        null,
                        'Hello ' + props.name + '!'));
            },
            close() {
                // Nothing to do here
            }
        };
    }
});

mount(HelloWorld({ name: 'Jane Doe' }), 'main-content');
