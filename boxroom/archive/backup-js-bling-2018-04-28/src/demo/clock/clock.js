import { createElement as h, defineComponent, mount } from 'js-bling';
import { defineMessages, defineProcess, Effects } from 'js-messages';

const
    createState = () => ({
        time: null,
        intervalId: null
    }),

    actions =  defineMessages({
        setTime: value => ({
            update: state => ({ ...state, time: value }),
        }),

        initTimer: () => ({
            effect: Effects.interval({
                milliseconds: 1000,
                onInit: date => actions.setTime(date.toLocaleTimeString()),
                onTick: date => actions.setTime(date.toLocaleTimeString()),
                startWhen: actions.startTimer,
                stopWhen: actions.stopTimer
            })
        }),

        startTimer: null,
        stopTimer: null
    });

const Clock = defineComponent({
    displayName: 'Clock',

    properties: {
        headline: {
            type: String,
            defaultValue: 'Current time:'
        }
    },

    init: defineProcess(actions, createState),

    lifecycle: {
        willMount: () => actions.initTimer(),
        didMount: () => actions.startTimer(),
        willUnmount: () => actions.stopTimer()
    },

    render({ props, state }) {
        return (
            h('div',
                h('h5', props.headline),
                state.time)
        );
    }
});

mount(Clock(), 'main-content'); 
