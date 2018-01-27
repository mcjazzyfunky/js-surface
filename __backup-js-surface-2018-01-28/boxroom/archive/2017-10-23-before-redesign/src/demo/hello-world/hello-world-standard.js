import {
    hyperscript as h,
    defineStandardComponent,
    mount
} from 'js-surface';

const HelloWorld = defineStandardComponent({
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
