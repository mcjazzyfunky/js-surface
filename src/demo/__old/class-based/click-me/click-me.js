import { createElement as h, defineComponent, mount } from 'js-surface';
import { Component } from 'js-surface/common/classes';

const ClickMe = defineComponent({
  displayName: 'ClickMe',

  properties: {
    text: {
      type: String,
      defaultValue: ''
    },

    onClick: {
      type: Function,
      nullable: true,
      defaultValue: null
    }
  },

  main: class extends Component {
    onClick() {
      alert(`You've clicked on "${this.props.text}"`);
    }

    render() {
      return (
        h('button', 
          { className: 'btn', onClick: this.onClick },
          this.props.text)
      );
    }
  }
});

mount(ClickMe({ text: 'Click me!' }), 'main-content');
