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
                h('h4', { ref: (it, that) => console.log('>>> ', it, that) },
                    'Current time:'),
                h('div', this.state.time))
        );
    }
});

render(Clock(), 'main-content');
