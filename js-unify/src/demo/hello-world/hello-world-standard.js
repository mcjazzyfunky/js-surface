import {
    hyperscript as h,
    defineStandardComponent,
    mount
} from 'js-unify';

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
            },
            close() {
                // Nothing to do here
            }
        };
    }
});

mount(HelloWorld({ name: 'Jane Doe' }), 'main-content');
