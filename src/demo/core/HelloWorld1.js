import { createElement as h, defineComponent } from 'js-surface';

const HelloWorld = defineComponent({
  displayName: 'HelloWorld',

  properties: {
    name: {
      type: String,
      defaultValue: 'World'
    }
  },

  main: {
    functional: true,

    render({ name }) {
      return h('div', `Hello ${name}!`);
    }
  }
});

export default HelloWorld({ name: 'Jane Doe' });
