import {
    createElement as h,
    defineClassComponent,
    render,
    Component
} from 'js-surface';


const Clock = defineClassComponent(class extends Component {
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
                h('h4', { ref: it => console.log(it) },
                    'Current time:'),
                h('div', this.state.time))
        );
    }
});

render(Clock(), 'main-content');
