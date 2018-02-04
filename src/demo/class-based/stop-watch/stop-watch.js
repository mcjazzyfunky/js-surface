import { defineComponent, mount }  from 'js-surface';
import { Component } from 'js-surface/generic/common';
import { Html } from 'js-surface/addons';

const { br, button, div, h3 } = Html;

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
                div(null,
                    h3(null,
                        'Stop watch'),
                    div(null,
                        `Time: ${this.state.time} `),
                        br(),
                        div({ className: 'btn-group' },
                            button(
                                {
                                    className: 'btn btn-primary',
                                    ...bind.startStopButton
                                },
                                this.state.running ? 'Stop' : 'Start'),
                            button(
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
