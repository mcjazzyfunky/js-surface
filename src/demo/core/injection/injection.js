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

    childContext: ['value'],

    init: updateView => ({
        receiveProps(props) {
            updateView(
                h('div', null,
                    h('div', null, 'Provided value: ', props.masterValue),
                    h('br'),
                    h('div', null,
                        ChildFunctional(),
                        ChildStandard(),
                        ChildFunctional({ value: 'with explicit value' }),
                        ChildStandard({ value: 'with another explicit value' }))),
                { value: props.masterValue });
        }
    })
});

const ChildFunctional = defineComponent({
    displayName: 'ChildFunctional',

    properties: {
        value: {
            type: String,
            inject: true,
            defaultValue: 'default value'
        }
    },

    render(props) {
        return h('div', null, 'ChildFunctional(', props.value, ')');
    }
});

const ChildStandard = defineComponent({
    displayName: 'ChildStandard',

    properties: {
        value: {
            type: String,
            inject: true,
            defaultValue: 'default value'
        }
    },

    init: updateView => ({
        receiveProps(props) {
            updateView(
                h('div', null, 'ChildStandard(', props.value, ')'));
        }
    })
});

mount(Parent({ masterValue: 'the injected value' }), 'main-content');
