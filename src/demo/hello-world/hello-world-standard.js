
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

    initProcess(onNextContent) {
        return {
            onProps(props) {
                onNextContent(dom('div', null, 'Hello ' + props.name + '!'));
            }
        };
    }
});

render(HelloWorld({ name: 'Jane Doe' }), 'main-content');
