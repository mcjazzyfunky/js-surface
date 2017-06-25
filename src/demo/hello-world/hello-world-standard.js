
import {
    createElement as dom,
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

    init(onContent) {
        return {
            propsCallback(props) {
                onContent(dom('div', null, 'Hello ' + props.name + '!'));
            },
            instance: {}
        };
    }
});

render(HelloWorld({ name: 'Jane Doe' }), 'main-content');
