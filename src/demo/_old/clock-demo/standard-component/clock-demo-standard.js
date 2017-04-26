import {
    createElement as dom,
    defineClassComponent,
    render,
    Component
} from 'js-surface';

class ClockComponent extends Component {
    constructor(initialProps) {
        super(initialProps);

        this.timerId = null;
        this.updateDateTime();
    }

    updateDateTime() {
        this.state = { dateTime: new Date() };
    }


    onWillMount() {
        this.updateDateTime();

        this.timerId = setInterval(
            () => this.updateDateTime(), 1000);
    }

    onWillUnmount() {
        clearInterval(this.timerId);

        this.timerId = null;
    }

    render() {
        return (
            dom('div',
                null,
                dom('label',
                    null,
                    this.props.label,
                    this.state.dateTime + '')));
    }
}

const Clock = defineClassComponent({
    displayName:  'Clock',

    properties: {
        label: {
            type: String,
            preset: 'Current time:'
        }
    },

    componentClass: ClockComponent
});

render(Clock(), 'main-content');