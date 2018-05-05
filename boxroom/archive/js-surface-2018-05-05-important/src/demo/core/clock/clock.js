import {
    createElement as h,
    defineComponent,
    mount
} from 'js-surface';

const Clock = defineComponent({
    displayName: 'Clock',

    init(props, refresh) {
        let
            time = null,
            intervalId = null;

        const
            updateTime = () => {
                time = new Date().toLocaleTimeString();
            },

            render = () => {
                return (
                    h('div', null,
                        h('h3', null,
                            'Current time'),
                        TimeInfo({ time }))
                );
            };
    
        updateTime();

        refresh(() => {
            intervalId = setInterval(() => {
                updateTime();
                refresh();
            }, 1000);
        });

        return {
            render,

            finalize() {
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
        return h('div', null, props.time);
    }
});

mount(Clock(), 'main-content');
