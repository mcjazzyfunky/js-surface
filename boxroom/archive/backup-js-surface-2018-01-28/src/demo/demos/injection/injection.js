import {
    createElement as h,
    defineComponent,
    mount
} from 'js-surface';

const Parent = defineComponent({
    displayName: 'Parent',

    properties: {
        masterValue: {
            type: String,
            defaultValue: 'default-value'
        }
    },

    provides: ['value'],

    init: updateView => ({
        setProps(props) {
            updateView(
                h('div', null,
                    h('div', null, 'Provided value: ', props.masterValue),
                    h('br'),
                    h('div', null,
                        ChildFunctionBased(),
                        ChildClassBased(),
                        ChildFunctionBased({ value: 'with explicit value' }),
                        ChildClassBased({ value: 'with another explicit value' }))),
                { value: props.masterValue });
        }
    })
});

const ChildFunctionBased = defineComponent({
    displayName: 'ChildFunctionBased',

    properties: {
        value: {
            type: String,
            inject: true,
            defaultValue: 'default value'
        }
    },

    render(props) {
        return h('div', null, 'ChildFunctionBased(', props.value, ')');
    }
});

const ChildClassBased = defineComponent({
    displayName: 'ChildClassBased',

    properties: {
        value: {
            type: String,
            inject: true,
            defaultValue: 'default value'
        }
    },

    init: updateView => ({
        setProps(props) {
            updateView(
                h('div', null, 'ChildClassBased(', props.value, ')'));
        }
    })
});

mount(Parent({ masterValue: 'the injected value' }), 'main-content');
