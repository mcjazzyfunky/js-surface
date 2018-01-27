import {
    hyperscript as h,
    defineClassComponent,
    defineFunctionalComponent,
    mount,
    Component
} from 'js-unify';

const parentMeta = {
    displayName: 'Parent',

    properties: {
        masterValue: {
            type: String,
            defaultValue: 'default-value'
        }
    },

    provides: ['value'],
};

class ParentComponent extends Component {
    provideChildInjections() {
        return {
            value: this.props.masterValue
        };
    }

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
}

const Parent = defineClassComponent(ParentComponent, parentMeta);

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

mount(Parent({ masterValue: 'the injected value' }), 'main-content');
