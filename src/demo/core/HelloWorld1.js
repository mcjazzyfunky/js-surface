import { createElement as h, defineComponent } from 'js-surface';

const HelloWorld = defineComponent({
  displayName: 'HelloWorld',

  properties: {
    name: {
      type: String,
      defaultValue: 'World'
    }
  },

  main() {
    return {
      render: ({ name }) => h('div', `Hello ${name}!`)
    };
  }
});

export default {
  title: 'Hello World 1',
  content: HelloWorld({ name: 'Jane Doe' })
};