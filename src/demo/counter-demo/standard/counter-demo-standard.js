import {
	createElement as dom,
	defineStandardComponent,
	defineFunctionalComponent,
	render,
} from 'js-surface';

const CounterInfo = defineFunctionalComponent({
    name: 'CounterInfo',

    properties: {
        value: {
            type: Number
        }
    },

    render(props) {
        return (
        	dom(
        		'label',
        		null,
        		dom('b',
        			null,
        			props.value)));
    }
});

// --------------------------------------------------------------------

const Counter = defineStandardComponent({
    name: 'Counter',

    properties: {
        initialValue: {
            type: Number,
            defaultValue: 0
        },
        onChange: {
        	type: Function
        }
    },

    publicMethods: {
    	resetCounter(value = 0) {
    		this.state = { counterValue: value };
    	}
    },

    init() {
        this.state = { counterValue: this.props.initialValue };
    },

	increaseCounter(delta) {
    	this.state = { counterValue: this.state.counterValue + delta };
	},

    shouldUpdate() {
    	console.log('[needsUpdate]', arguments);
    	return true;
    },

    onWillReceiveProps(nextProps) {
        console.log('[onWillReceiveProps]', arguments);
    },

    onWillChangeState(nextState) {
        console.log('[onWillChangeState]', arguments);
    },

    onDidChangeState(prevState) {
        console.log('[onDidChangeState]', arguments);

        if (this.props.onChange) {
        	this.props.onChange({
        		type: 'change',
        		value: this.state.counterValue
        	});
        }
    },

    onWillMount() {
        console.log('[onWillMount]', arguments);
    },

    onDidMount() {
        console.log('[onDidMount]', arguments);
    },

    onWillUpdate() {
        console.log('[onWillUpdate]', arguments);
    },

    onDidUpdate() {
        console.log('[onDidUpdate]', arguments);
    },

    onWillUnmount() {
        console.log('[onWillUnmount]:', arguments);
    },

    render() {
         return (
            dom('span',
                { className: 'counter' },
                dom('button',
                    { onClick: () => this.increasesCounter(-1) },
                    '-'),
                dom('div',
                    null,
                    CounterInfo({ value: this.state.counterValue })),
                dom('button',
                    { onClick: () => this.increaseCounter(1) },
                    '+'))
        );
    }
});

// --------------------------------------------------------------------

const CounterCtrl = defineFunctionalComponent({
    name: 'CounterCtrl',

    render() {
        let counterInstance = null;

        return (
            dom('div',
                { className: 'counter-ctrl' },
                dom('button',
                	{ onClick: () => counterInstance.resetCounter(0) },
                	'Reset to 0'),
                	' ',
            		Counter({ ref: it => counterInstance = it }),
                	' ',
                	dom('button',
                		{ onClick: () => counterInstance.resetCounter(100) },
                		'Reset to 100')));
    }
});

render(CounterCtrl(), 'main-content');

