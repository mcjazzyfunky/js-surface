import { createElement as h, defineComponent, mount } from 'js-surface';
import { Component } from 'js-surface/common';

const Parent = defineComponent({
    displayName: 'Parent',

    properties: {
        children: {
        }
    },

    childContext: ['parentDisabled'],

    main: class extends Component {
        constructor(props) {
            super(props);

            this.state = { disabled: false }; 
        }

        toggleDisableState() {
            this.setState({
                disabled: !this.state.disabled
            });
        }

        getChildContext() {
            const ret = { parentDisabled: this.state.disabled };

            return ret;
        }

        render() {
            return (
                h('div', null,
                    h('div', null,
                        'Parent component is ', this.state.disabled ? 'disabled' : 'enabled', '.'),
                    h('button', { onClick: () => this.toggleDisableState() },
                        this.state.disabled ? 'Enable' : 'Disable'),
                    h('div', null, this.props.children))
            );
        }
    }
});

const Child = defineComponent({
    displayName: 'Child',

    properties: {
        parentDisabled: {
            type: Boolean,
            inject: true,
            defaultValue: false
        }
    },

    //main: class extends Component {
        render(props) {
            return (
                h('div', null,
                    'Child component is ',
                    props.parentDisabled ? 'disabled' : 'enabled',
                    '.')
            );
        }
    //}
});

const Container = defineComponent({
    displayName: 'Container',

    properties: ['children'],

    main: class extends Component {
        shouldComponentUpdate() {
            console.log('Container decides whether it should update');
            
            return false;
        }

        render() {
            console.log('Container is rendering');
            
            return (
                h('div', null,
                    h('div', null, this.props.children))
            );
        }
    }
});

mount(Parent(null, Container(null, Child())), 'main-content'); 
