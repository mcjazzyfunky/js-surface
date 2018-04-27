import { createElement as h, defineComponent, mount } from 'js-bling';
import { defineMessages, defineProcess, defineDispatcher } from 'js-messages';

const
    createState = () => ({
        intervalId: null,
        showFoo: true
    }),

    actions = defineMessages({
        updates: {
            setIntervalId: intervalId => () => ({ intervalId }),
            setShowFoo: value => () => ({ showFoo: value }),
        },

        effects: {
            start: () => self => {
                const intervalId = setInterval(() => {
                    self.dispatch(actions.setShowFoo(!self.state.showFoo));
                }, 3000);

                self.dispatch(actions.setIntervalId(intervalId));
            },

            stop: () => self => {
                clearInterval(self.state.intervalId);
                self.dispatch(actions.setIntervalId(null));
            },

            showRefInfo: (ref, type) => () => {
                console.log(`Invoked ref callback - ${type}: `, String(ref));
            }
        }
    }),

    log = defineMessages({
        info: (...args) => () => {
            console.log(...args);
        }
    });

const MountUnmount = defineComponent({
    displayName: 'MountUnmount',

    init: defineProcess(actions, createState),

    lifecycle: {
        didMount: () => actions.start(),
        willUnmount: () => actions.stop()
    },

    events: {
        getUpdateRef: type => ref => actions.showRefInfo(ref, type)
    },

    render({ state, events }) {
        return state.showFoo
            ? ComponentA({ ref: events.getUpdateRef('ComponentA') })
            : ComponentB({ ref: events.getUpdateRef('ComponentB')});
    }
});

const ComponentA = defineComponent({
    displayName: 'ComponentA',

    initDispatcher: defineDispatcher({}), // TODO

    lifecycle: {
        didMount: () => log.info('Did mount ComponentA...'),
        willUnmount: () => log.info('Will unmount ComponentA...')
    },

    render() {
        return h('div', ' - - - ComponentA - - - ');
    }
});

const ComponentB = defineComponent({
    displayName: 'ComponentB',

    initDispatcher: defineDispatcher({}), // TODO

    lifecycle: {
        didMount: () => log.info('Did mount ComponentB...'),
        willUnmount: () => log.info('Will unmount ComponentB...')
    },

    render() {
        return h('div', ' - - - ComponentB - - - ');
    }
});

mount(MountUnmount(), 'main-content');
