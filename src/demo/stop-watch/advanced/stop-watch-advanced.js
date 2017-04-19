import {
    defineDispatcherBasedComponent,
  //  defineMessages,
    hyperscript as dom,
    render,
    Component,
}  from 'js-surface';

const
    Action = defineMessages({
        SetTime: milliseconds => ({
            milliseconds
        }),

        SetRunning: running => ({
            running
        }),

        StartTimer: null,
        StopStimer: null,
        ResetTimer: null
    }),

    initialState = Immutable.Map({ time: 0, running: false }),

    reducer = (state, action) => {
        let ret = state;

        switch (action.constructor) {
            case Action.SetTime:
                ret = state.set('time', action.milliseconds);
                break;

            case Action.SetRunning:
                ret = state.set('running', true);
                break;

                return ret;
        },

        rootSaga: function* () {

        }
    }



const StopWatch = defineDispatcherBasedComponent({
    name: 'StopWatch',

    properties: {
    },

    onWillUnmount({ dispatch }) {
        dispatch(Action.StopTimer());
    },

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
                    dom('button',
                        bind.startStopButton,
                        this.state.running ? 'Stop' : 'Start'),
                    dom('button',
                        bind.resetButton,
                        'Reset'))
        );
    }
});

render(StopWatch(), 'main-content');
