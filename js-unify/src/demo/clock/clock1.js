import {
    createElement,
    defineComponent,
    mount
} from 'js-surface';

const Clock = defineComponent({
    displayName: 'Clock',

    properties: {
        headline: {
            type: String,
            defaultValue: 'Time:'
        }
    },
    
    init(updateView, forwardState) {
        let
            props = null,
            state = null;

        function updateState() {
            state = {
                time: new Date() .toLocaleTimeString()
            };

            forwardState(state);
        }

        function update() {
            updateState();

            updateView(
                createElement('div',
                    null,
                    createElement('h4',
                        null,
                        props.headline),
                    state.time));
        }

        const timerId = setInterval(update, 1000);

        return {
            setProps(nextProps) {
                props = nextProps;
                update();
            },

            close() {
                clearTimeout(timerId);
            }
        };
    }
});

mount(Clock({ headline: 'Local time:' }), 'main-content'); 
