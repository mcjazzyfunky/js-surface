import {
    createElement as h,
    mount,
    Component 
}  from 'js-surface';

const meta = {
    displayName: 'StopWatch',

    properties: {},
};

class StopWatchClass extends Component {
    constructor() {
        super();
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

    onStartStopClick() {
        if (this.state.running) {
            this.stopTimer();
        } else {
            this.startTimer();
        }
    }

    onResetClick() {
        this.resetTimer();
    }

    render() {
        return (
            h('div',
                h('h3',
                    'Stop watch'),
                h('div',
                    `Time: ${this.state.time} `),
                    h('br'),
                    h('div.btn-group',
                        h('button.btn.btn-primary',
                            { onClick: () => this.onStartStopClick() },
                            this.state.running ? 'Stop' : 'Start'),
                        h('button.btn.btn-warning',
                             { onClick: () => this.onResetClick() },
                            'Reset')))
        );
    }
}

Object.assign(StopWatchClass, meta);

const StopWatch = StopWatchClass.asFactory();

mount(StopWatch(), 'main-content');
