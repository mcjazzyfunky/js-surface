import { defineComponent, defineIntents, createElement as htm, Types, isElement } from 'js-surface';

import { Seq } from 'js-prelude';

import TextField from '../../main/js/components/TextField.js';

const name = 'FKInputsDemo';

const Intents = defineIntents({
    setFirstName: true
});

function initState(props) {
    return { firstName: 'John Doe' };
}

const stateReducer = {
    setFirstName(value) {
        return state => Object.assign({}, state, { firstName: value });
    }
}

function render({ props, state,  send }) {
	const onChange = ev => {
		 send(Intents.setFirstName(ev.value))
	};


    return (
        htm('div',
            null,
            RandomLabel(),
            state.firstName,
            TextField({
                label: 'First name:',
                value: state.firstName,
                onChange
            })));
}


export default defineComponent({
    name,
    initState,
    stateReducer,
    render
})


const RandomLabel = defineComponent({
	name: "RandomLabel",
	initState() {
		return null;
	},

	onDidUpdate() {

	},


	render() {
		return htm('label', null, Math.random());
	}
});