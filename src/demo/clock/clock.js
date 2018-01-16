import {
    hyperscript as h,
    defineComponent,
    mount
} from 'js-surface';

const Clock = defineComponent({
    displayName: 'Clock',

    init(updateView) {
        let
            time = null,
            intervalId = null;

        const
            updateTime = () => {
                time = new Date().toLocaleTimeString();
            },

            render = () => {
                return (
                    h('div',
                        h('h3', 'Current time'),
                        TimeInfo({ time }))
                );
            };
    
        updateTime();
        
        intervalId = setInterval(() => {
            updateTime();
            updateView(render());
        }, 1000);

        return {
            setProps() {
                updateView(render());
            },

            close() {
                clearInterval(intervalId);
                intervalId = null;
            }
        };
    }
});

const TimeInfo = defineComponent({
    displayName: 'TimeInfo',
    
    properties: {
        time: {
            type: String
        }
    },

    render(props) {
        return h('div', props.time);
    }
});

mount(Clock(), 'main-content');
