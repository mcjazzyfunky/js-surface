import {
    createElement as dom,
    defineClassComponent,
    defineFunctionalComponent,
    render,
    Component
} from 'js-surface';

const Parent = defineClassComponent(class extends Component {
    static get displayName() {
        return 'Parent';
    }

    static get properties() {
        return {
            value: {
                type: String
            }
        };
    }

    static get childInjection() {
        return {
            keys: ['value'],

            get(props) {
                return {
                    value: props.value
                };
            }
        };
    }

    render() {
        return dom('div',
            dom('div', 'Provided value: ', this.props.value),
            dom('div',
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
            preset: 'default value'
        }
    },

    render(props) {
        return dom('div', 'ChildFunctionBased(', props.value, ')');
    }
});

const ChildClassBased = defineClassComponent(class extends Component {
    static get displayName() {
        return 'ChildClassBased';
    }

    static get properties() {
        return {
            value: {
                type: String,
                inject: true,
                preset: 'default value'
            }
        };
    }

    render() {
        return dom('div', 'ChildClassBased(', this.props.value, ')');
    }
});

render(Parent({ value: 'the injected value' }), 'main-content');