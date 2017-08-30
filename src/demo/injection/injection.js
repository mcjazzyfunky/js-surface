import {
    createElement as h,
    defineComponent,
    render
} from 'js-surface';

const Parent = defineComponent({
    displayName: 'Parent',

    properties: {
        masterValue: {
            type: String,
            defaultValue: 'default-value'
        }
    },

    constructor() {
    },

    childInjections: ['value'],

    provideChildInjections() {
        return {
            value: this.props.masterValue
        };
    },

    render() {
        return h('div',
            h('div', 'Provided value: ', this.props.masterValue),
            h('br'),
            h('div',
                ChildFunctionBased(),
                ChildClassBased(),
                ChildFunctionBased({ value: 'with explicit value' }),
                ChildClassBased({ value: 'with another explicit value' })));
    }
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
        return h('div', 'ChildFunctionBased(', props.value, ')');
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

    constructor() {
    },

    render() {
        return h('div', 'ChildClassBased(', this.props.value, ')');
    }
});

render(Parent({ masterValue: 'the injected value' }), 'main-content');
