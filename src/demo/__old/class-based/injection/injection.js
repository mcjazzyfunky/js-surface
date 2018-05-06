import { createElement as h, defineComponent, mount } from 'js-surface';
import { Component } from 'js-surface/common/classes';

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
        h('div', null,
          h('div', null,
            `Provided value: ${this.props.masterValue}`),
          h('br'),
          h('div', null,
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
      h('div', null,
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
        h('div', null,
          `ChildClassBased(${this.props.value})`)
      );
    }
  }
});

mount(Parent({ masterValue: 'the injected value' }), 'main-content');
