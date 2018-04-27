import { createElement as h, defineComponent, mount }  from 'js-bling';
import { defineMessages, defineProcess, Effects } from 'js-messages';

const
    createState = () => ({
        intervalId: null,
        time: 0,
        running: false
    }),

    actions = defineMessages({
        setTime: time => ({
            update: state => ({ ...state, time })
        }),

        setRunning: running => ({
            update: state => ({ ...state, running })
        }),

        startTimer: () => ({
            effect: Effects.interval({
                milliseconds: 4,
                stopWhen: [actions.stopTimer, actions.resetTimer],
                onStart: () => actions.setRunning(true),
                onTick: (now, startTime) => actions.setTime(now.getTime() - startTime.getTime()),
                onStop: () => actions.setRunning(false)
            })
        }),

        stopTimer: null,

        resetTimer: () => ({
            effect: Effects.dispatch(actions.setTime(0))
        }),
    });
    
const StopWatch = defineComponent({
    displayName: 'StopWatch',

    init: defineProcess(actions, createState),

    lifecylce: {
        willUnmount: () => actions.resetTimer(),
    },

    events: {
        clickStartStop: () => ({ state }) =>
            !state.running
                ? actions.startTimer()
                : actions.stopTimer(),

        clickReset: () => actions.resetTimer()
    },

    render({ state, bind }) {
        return (
            h('div',
                h('h3', 'Stop watch'),
                h('div',
                    h('div', `Time: ${state.time} ms`),
                    h('br'),
                    h('.btn-group',
                        h('button.btn.btn-primary',
                            { onClick: bind('clickStartStop') },
                            state.running ? 'Stop' : 'Start'),
                        h('button.btn.btn-warning',
                            { onClick: bind('clickReset') },
                            'Reset'))))
        );
    }
});

mount(StopWatch(), 'main-content');
