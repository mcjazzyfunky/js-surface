import { createElement as h, defineComponent, Fragment } from 'js-surface';
import { render, Component } from 'js-surface/addons';

const HelloWorld1 = defineComponent({
  displayName: 'HelloWorld1',

  properties: {
    name: {
      type: String,
      defaultValue: 'World'
    }
  },

  main: render(props => {
    return (
      h('div', null, `Hello ${props.name}!`)
    );
  })
});

const HelloWorld2 = defineComponent({
  displayName: 'HelloWorld2',

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
  title: 'Hello world 2',
  content: Fragment(HelloWorld1(), HelloWorld2({ name: 'Julia Doe' }))
};
