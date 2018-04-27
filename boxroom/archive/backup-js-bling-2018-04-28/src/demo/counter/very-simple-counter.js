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
        caption: {
            type: String,
            defaultValue: 'Counter'
        },

        initialValue: {
            type: Number,
            constraint: Spec.integer,
            defaultValue: 0
        }
    },

    init: defineProcess(actions, createState),

    lifecycle: {
        willMount: ({ props, state }) =>
            Effects.log('component will mount- props:', props, 'state:', state),
        
        didUpdate: ({ props, state }) =>
            Effects.log('component did update - props:', props, 'state:', state)
    },

    events: {
        increment: () => actions.incrementCounter(1)
    },

    render({ props, state, bind }) {
        return (
            h('button.btn',
                { onClick: bind('increment') },
                `${props.caption}: ${state.counter}`)
        );
    }
});

mount(SimpleCounter(), 'main-content');