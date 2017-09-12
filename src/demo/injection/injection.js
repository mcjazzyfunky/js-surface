import {
    createElement as h,
    defineClassComponent,
    defineFunctionalComponent,
    render
} from 'js-surface';

const Parent = defineClassComponent({
    displayName: 'Parent',

    properties: {
        masterValue: {
            type: String,
            defaultValue: 'default-value'
        }
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

const ChildFunctionBased = defineFunctionalComponent({
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

const ChildClassBased = defineClassComponent({
    displayName: 'ChildClassBased',

    properties: {
        value: {
            type: String,
            inject: true,
            defaultValue: 'default value'
        }
    },

    render() {
        return h('div', 'ChildClassBased(', this.props.value, ')');
    }
});

render(Parent({ masterValue: 'the injected value' }), 'main-content');
