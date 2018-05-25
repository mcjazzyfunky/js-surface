import { createElement as h, defineComponent, Fragment } from 'js-surface';
import { view, Component } from 'js-surface/common';

const HelloWorld1 = defineComponent({
  displayName: 'HelloWorld_A',

  properties: {
    name: {
      type: String,
      defaultValue: 'World'
    }
  },

  main: view(props => {
    return (
      h('div', null, `Hello ${props.name}!`)
    );
  })
});

const HelloWorld2 = defineComponent({
  displayName: 'HelloWorld_B',

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


export default Fragment(HelloWorld1(), HelloWorld2({ name: 'Julia Doe' }));
