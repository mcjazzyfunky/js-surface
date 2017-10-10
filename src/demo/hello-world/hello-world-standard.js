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

    init(updateView) {
        return {
            receiveProps(props) {
                updateView(h('div', 'Hello ' + props.name + '!'));
            }
        };
    }
});

render(HelloWorld({ name: 'Jane Doe' }), 'main-content');
