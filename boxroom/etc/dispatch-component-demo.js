import {
	createElement as h,
	defineDispatchComponent
} from 'js-surface';

import { defineMessages } from 'js-messages';

const
    Actions = defineMesages({
	    incrementCounter: delta => ({ delta }),
	    setNode: node => ({ node }),
		// ...
    }),

    Events = {
        decrementClick: Actions.increment(-1),
	    incrementClick: Actions.increment(1),
        nodeRef: node => Actions.setNode(node)
	},
	
	CounterStore = defineStore({
		initState({ intialValue = 0 }) {
			return { counterValue: initialValue };
		},
		
		updateState: {
		    [Actions.INCREMENT_COUNTER]: {
			    counterValue: (value, { delta }) => value + delta
			}
		}
	}),
	
	middleware = '...';
	
export default defineDispatchComponent({
    displayName: 'Counter',
	
	properties: {
		initialValue: {
		    type: Number,
			constraint: Spec.integer,
			defaultValue: 0
		}
	},
	
	init(props) {
		return CounterStore.create({ counter: props.initialValue }, middleware);
	},
	
	lifecycle: {
	    didMount: ({ props, state }) => Actions.xxx(/*...*/),
		willUnmount: ({ props, state }) => Action.yyy(/*...*/)
	},
	
	render(props, state, bind) {
	   return (
	       h('div',
		       { ref: bind(Events.nodeRef) },
		       h('button',
			       { onClick: bind(Events.incrementClick) },
				   '-'),
			   state.counterValue,
			   h('button',
			       { onClick: bind(Events.incrementClick) },
				   '-'))
	   );
	}
});
