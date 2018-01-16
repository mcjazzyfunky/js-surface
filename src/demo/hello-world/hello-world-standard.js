import {
    hyperscript as h,
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

    init(setView) {
        return {
            setProps(props) {
                setView(h('div', 'Hello ' + props.name + '!'));
            }
        };
    }
});

mount(HelloWorld({ name: 'Jane Doe' }), 'main-content');
