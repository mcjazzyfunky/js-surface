import {
    createElement as h,
    defineComponent,
    render
} from 'js-surface';

const Clock = defineComponent({
    displayName: 'Clock',

    constructor() {
        this.interval = null;
        this.updateState();
    },

    updateState() {
        this.state = { time: new Date().toLocaleTimeString() };
    },

    onDidMount() {
        this.interval = setInterval(() => {
            this.updateState(); 
        }, 1000);
    },

    onWillUnmount() {
        clearInterval(this.interval);
        this.interval = null;
    },

    render() {
        return (
            h('div',
                h('h3', 'Current time'),
                TimeInfo({time: this.state.time, ref: (it, that) => console.log(it, that) }))
        );
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

render(Clock(), 'main-content');
