import { createElement as h, defineComponent } from 'js-surface';
import { render } from 'js-surface/addons';

const HelloWorld = defineComponent({
  displayName: 'HelloWorld',

  properties: {
    name: {
      type: String,
      defaultValue: 'World'
    }
  },

  main: render(({ name }) => {
    return (
      h('div', `Hello ${name}!`)
    );
  })
});

export default {
  title: 'Hello World (render)',
  content: HelloWorld({ name: 'John Doe' })
};