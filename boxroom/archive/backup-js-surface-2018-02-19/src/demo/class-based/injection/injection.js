import { defineComponent, mount, Html } from 'js-surface';
import { Component } from 'js-surface/common';

const { br, div } = Html;

const Parent = defineComponent({
    displayName: 'Parent',

    properties: {
        masterValue: {
            type: String,
            defaultValue: 'default-value'
        }
    },

    childContext: ['value'],

    main:  class extends Component {
        getChildContext() {
            return {
                value: this.props.masterValue
            };
        }

        render() {
            return (
                div(null,
                    div(null,
                        `Provided value: ${this.props.masterValue}`),
                    br(),
                    div(null,
                        ChildFunctionBased(),
                        ChildClassBased(),
                        ChildFunctionBased({ value: 'with explicit value' }),
                        ChildClassBased({ value: 'with another explicit value' })))
            );
        }
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
        return (
            div(null,
                `ChildFunctionBased(${props.value})`)
        );
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

    main: class extends Component {
        render () {
            return (
                div(null,
                    `ChildClassBased(${this.props.value})`)
            );
        }
    }
});

mount(Parent({ masterValue: 'the injected value' }), 'main-content');
