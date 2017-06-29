
import {
    createElement as h,
    defineComponent,
    render
} from 'js-surface';

const HelloWorld = defineComponent({
    displayName:  'HelloWorld',

    properties: {
        name:  {
            type: String,
            defaultValue: 'World'
        }
    },

    init(onContent) {
        return {
            propsConsumer(props) {
                onContent(h('div > textarea', 'Hello ' + props.name + '!'));
            },
            instance: {}
        };
    }
});

render(HelloWorld({ name: 'Jane Doe' }), 'main-content');
