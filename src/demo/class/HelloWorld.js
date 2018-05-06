import { createElement as h, defineComponent } from 'js-surface';
import { Component } from 'js-surface/classes';

const HelloWorld = defineComponent({
  displayName: 'HelloWorld',

  properties: {
    name: {
      type: String,
      defaultValue: 'World'
    }
  },

  main: class extends Component {
    render() {
      return (
        h('div', null, `Hello ${this.props.name}!`)
      );
    }
  }
});

export default {
  title: 'Hello world (class)',
  content: HelloWorld({ name: 'Julia Doe' })
};
