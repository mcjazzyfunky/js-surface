/* global jQuery */

import ComponentHelper from '../helpers/ComponentHelper.js';
import PaginationHelper from '../helpers/PaginationHelper.js';

import { defineClassComponent, createElement as dom } from 'js-surface';
import { Seq, Strings } from 'js-prelude';

const name = 'TextField';

let nextAutoId = 0;

const properties = {
    className: {
        type: String,
        defaultValue: null
    },

    defaultValue: {
        type: String,
        defaultValue: null
    },

    disabled: {
        type: Boolean,
        defaultValue: false
    },

    id: {
        type: String,
        defaultValue: ''
    },

    label: {
        type: String,
        defaultValue: ''
    },

    onChange: {
        type: Function,
        defaultValue: null
    },

    readOnly: {
        type: Boolean,
        defaultValue: false
    },

    value: {
        type: String,
        defaultValue: null
    }
};

const Intents = defineIntents({
    setValue: true,
    callback: true
});

function initState(props) {
    let value = props.value;

    if (props.value === null) {
        value = props.defaultValue;
    }

    if (value === undefined || value === null) {
        value = '';
    }

    return { value };
}

const stateReducer = {
    setValue(val) {
        return state => ({ value: val });
    }
};

function initInteractor(send) {
    return {
        callback(func, event) {
            func(event);
        }
    };
}

function onNextProps({ props, nextProps, state, send }) {
    console.log('onNextProps:', props.value, nextProps.value, state.value)
    if (props.value !== null && nextProps.value !== state.value) {
        send(Intents.setValue(nextProps.value));
    }
}

function render({ props, state, prevState, send }) {
    const
        onChange = event => {
            const newValue = event.target.value;
console.log(event.target);
            if (props.onChange) {
                send(Intents.callback(props.onChange, createChangeEvent(newValue)));
            }
        },

        id = props.id ? props.id : 'fk--text-field-' + (nextAutoId++),
        label = createLabel(props.label + ' state: ' + state.value + ', props: ' + props.value, id),
        value = state.value,
        prevValue = prevState ? prevState.value : null,
        className = ComponentHelper.buildCssClass('form-group fk-text-field', props.className);

    if (prevValue !== null && value !== prevValue && props.onChange) {
        send(Intents.callback(
            props.onChange,
            createChangeEvent(value)));
    }

    return (
        dom('div',
            { className },
            label,(console.log(33333, state)),
            dom('input',
                { className: 'form-control'
                , type: 'text'
                , id: id
                , value: '' + state.value
                , onChange
                , disabled: props.disabled
                , readOnly: props.readOnly
                }))
    );
}

export default defineComponent({
    name,
    properties,
    initState,
    //stateReducer,
    initInteractor,
    onNextProps,
    render
});

// -------------------------------------------------------------------

function createLabel(text, id) {
    let ret;

    if (typeof text !== 'string' || text.trim().length === 0) {
        ret = null;
    } else {
        ret = dom('label', { htmlFor: id }, text.trim());
    }

    return ret;
}

function createChangeEvent(value) {
    return ({
        type: 'change',
        value
    });
}
