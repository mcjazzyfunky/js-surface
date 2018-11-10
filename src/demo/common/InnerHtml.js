import { createElement as h, defineComponent } from 'js-surface';
import { view } from 'js-surface/common';

const Demo = defineComponent({
  displayName:  'Demo',

  main: view(() => {
    return (
      h('div', {
        dangerouslySetInnerHTML: {
          __html: 'Some <b>HTML</b> <i>text</i>'
        }
      }));
  })
});

export default Demo();