
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
            preset: 'World'
        }
    },

    init(onContent) {
        return {
            onProps(props) {
                onContent(dom('div', null, 'Hello ' + props.name + '!'));
            }
        };
    }
});

render(HelloWorld({ name: 'Jane Doe' }), 'main-content');
