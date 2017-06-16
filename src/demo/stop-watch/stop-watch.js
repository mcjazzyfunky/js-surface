import {
    defineClassComponent,
    createElement as dom,
    render,
    Component,
}  from 'js-surface';

class StopWatchComponent extends Component {
    static get displayName() {
        return 'StopWatch';
    }

    static get properties() {
        return {};
    }

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
            dom('div',
                dom('h3',
                    'Stop watch'),
                dom('div',
                    `Time: ${this.state.time} `),
                    dom('br'),
                    dom('div.btn-group',
                        dom('button.btn.btn-primary',
                            bind.startStopButton,
                            this.state.running ? 'Stop' : 'Start'),
                        dom('button.btn.btn-warning',
                            bind.resetButton,
                            'Reset')))
        );
    }
}

const StopWatch = defineClassComponent(StopWatchComponent);

render(StopWatch(), 'main-content');
