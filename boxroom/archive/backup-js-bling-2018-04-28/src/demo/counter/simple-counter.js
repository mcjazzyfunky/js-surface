import { createElement as h, defineComponent, mount } from 'js-bling';
import { defineMessages, defineProcess, Effects } from 'js-messages';
import { Spec } from 'js-spec';

const
    createState = props => ({ counter: props.initialValue }),

    actions = defineMessages({
        incrementCounter: delta => ({
            update: state => ({ counter: state.counter + delta })
        })
    });

const SimpleCounter = defineComponent({
    displayName: 'SimpleCounter',

    properties: {
        label: {
            type: String,
            defaultValue: 'Counter:'
        },

        initialValue: {
            type: Number,
            constraint: Spec.integer,
            defaultValue: 0
        }
    },

    init: defineProcess(actions, createState),

    lifecycle: {
        didMount: ({ props, state }) => Effects.log('component did mount', props, state),
        didUpdate: ({ props, state }) => Effects.log('component did update', props, state)
    },

    events: {
        clickIncrement: () => actions.incrementCounter(1),
        clickDecrement: () => actions.incrementCounter(-1)
    },

    render({ props, state, bind }) {
        return (
            h('.simple-counter',
                h('label.simple-counter-label.btn', props.label),
    
                h('button.simple-counter-decrease-button.btn.btn-default',
                    { onClick: bind('clickDecrement') },
                    '-'),

                h('.simple-counter-value.btn', state.counter),

                h('button.simple-counter-increase-button.btn.btn-default',
                    { onClick: bind('clickIncrement') },
                    '+'))
        );
    }
});

mount(SimpleCounter(null, 'Click counter'), 'main-content');
