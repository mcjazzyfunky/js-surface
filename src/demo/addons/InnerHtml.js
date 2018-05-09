import { createElement as h, defineComponent } from 'js-surface';
import { render } from 'js-surface/addons';

const Demo = defineComponent({
  displayName:  'Demo',

  main: render(() => {
    return (
      h('div', {
        dangerouslySetInnerHTML: {
          __html: 'Some <b>HTML</b> <i>text</i>'
        }
      }));
  })
});

export default Demo();