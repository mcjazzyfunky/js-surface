import {
    createElement as dom,
    defineBasicComponent,
    render
} from 'js-surface';

const HelloWorld = defineBasicComponent({
    name: 'HelloWorld',

    properties: {
        name: {
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

render(HelloWorld(), 'main-content');
