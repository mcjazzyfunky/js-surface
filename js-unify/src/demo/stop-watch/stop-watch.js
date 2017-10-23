import {
    createElement as h,
    defineClassComponent,
    mount,
    Component 
}  from 'js-unify';

const meta = {
    displayName: 'StopWatch',

    properties: {},
};

class CustomComponent extends Component {
    constructor(props) {
        super(props);
        this.timerID = null;
        this.state = { time: 0, running: false };
    }

    setTime(time) {
        const running = this.state.running;

        this.state = { time, running };
    }

    setRunning(running) {
        const time = this.state.time;

        this.state = { time, running };
    }

    startTimer() {
        if (!this.state.running) {
            const startTime = Date.now() - this.state.time;

            this.timerID = setInterval(() => {
                this.setTime(Date.now() - startTime);
            }, 10);

            this.setRunning(true);
        }
    }

    stopTimer() {
        if (this.state.running) {
            clearInterval(this.timerID);
            this.timerID = null;
            this.setRunning(false);
        }
    }

    resetTimer() {
        this.stopTimer();
        this.setTime(0);
    }

    onWillUnmount() {
        this.stopTimer();
    }

    render() {
        const bind = {
            startStopButton: {
                onClick: () => {
                    if (this.state.running) {
                        this.stopTimer();
                    } else {
                        this.startTimer();
                    }
                }
            },
            resetButton: {
                onClick: () => {
                    this.resetTimer();
                }
            }
        };

        return (
            h('div',
                h('h3',
                    'Stop watch'),
                h('div',
                    `Time: ${this.state.time} `),
                    h('br'),
                    h('div.btn-group',
                        h('button.btn.btn-primary',
                            bind.startStopButton,
                            this.state.running ? 'Stop' : 'Start'),
                        h('button.btn.btn-warning',
                            bind.resetButton,
                            'Reset')))
        );
    }
}

const StopWatch = defineClassComponent(CustomComponent, meta);

mount(StopWatch(), 'main-content');
