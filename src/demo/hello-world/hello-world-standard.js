import {
    createElement as h,
    defineStandardComponent,
    render
} from 'js-surface';

const HelloWorld = defineStandardComponent({
    displayName:  'HelloWorld',

    properties: {
        name:  {
            type: String,
            defaultValue: 'World'
        }
    },

    init(viewConsumer) {
        return {
            propsConsumer(props) {
                viewConsumer(h('div', 'Hello ' + props.name + '!'));
            },
            instance: {}
        };
    }
});

render(HelloWorld({ name: 'Jane Doe' }), 'main-content');
