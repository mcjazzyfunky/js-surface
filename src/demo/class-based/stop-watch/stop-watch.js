import { createElement as h, defineComponent, mount }  from 'js-surface';
import { Component } from 'js-surface/common';

const StopWatch = defineComponent({
    displayName: 'StopWatch',

    main: class extends Component {
        constructor(props) {
            super(props);
            this.timerID = null;
            this.state = { time: 0, running: false };
        }

        setTime(time) {
            const running = this.state.running;

            this.setState({ time, running });
        }

        setRunning(running) {
            const time = this.state.time;

            this.setState({ time, running });
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
                h('div', null,
                    h('h3', null,
                        'Stop watch'),
                    h('div', null,
                        `Time: ${this.state.time} `),
                        h('br'),
                        h('div', { className: 'btn-group' },
                            h('button',
                                {
                                    className: 'btn btn-primary',
                                    ...bind.startStopButton
                                },
                                this.state.running ? 'Stop' : 'Start'),
                            h('button',
                                {
                                    className: 'btn btn-warning',
                                    ...bind.resetButton
                                },
                                'Reset')))
            );
        }
    }
});

mount(StopWatch(), 'main-content');
