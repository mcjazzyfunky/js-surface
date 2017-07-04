import {
    createElement as h,
    defineComponent,
    render,
    Component
} from 'js-surface';

const Clock = defineComponent(class extends Component {
    static get displayName() {
        return 'Clock';
    }

    constructor(props) {
        super(props);

        this.interval = null;
        this.updateState();
    }

    updateState() {
        this.state = { time: new Date().toLocaleTimeString() };
    }

    onDidMount() {
        this.interval = setInterval(() => {
            this.updateState(); 
        }, 1000);
    }

    onWillUnmount() {
        clearInterval(this.interval);
        this.interval = null;
    }

    render() {
        return (
            h('div',
                h('h3', 'Current time'),
                TimeInfo({time: this.state.time, ref: (it, that) => console.log(it, that) }))
        );
    }
});

const TimeInfo = defineComponent(class extends Component {
    static get displayName() {
        return 'TimeInfo';
    }
    
static get properties() {
    return ['time'];
}
    static get xproperties() {
        return {
            time: {
                type: String
            }
        };
    }

    render() {
        return h('div', this.props.time);
    }
});

render(Clock(), 'main-content');
