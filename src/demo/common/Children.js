import { createElement as h, defineComponent } from 'js-surface';
import { Component } from 'js-surface/common';

const Demo = defineComponent({
  displayName: 'Demo',

  main: class extends Component {
    render() {
      return (
        h('div', Child(), Child('Please'), Child('check', ' ', 'console!'))
      );
    }
  }
});

const Child = defineComponent({
  displayName: 'Child',

  main: class extends Component {
    static deriveStateFromProps(props) {
      console.log('deriveStateFromProps:', props);
      return null;
    }

    render() {
      console.log('render:', this.props);
      return h('div', this.props.children);
    }
  }
});

export default Demo();