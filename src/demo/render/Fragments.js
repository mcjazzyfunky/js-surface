import { createElement as h, defineComponent, mount, Fragment } from 'js-surface';
import { render } from 'js-surface/render';

const FragmentDemo = defineComponent({
  displayName:  'FragmentDemo',

  main: render(() => {
    return (
      h(Fragment, null,
        h('div', null,
          'This text line is an element inside of an fragment.'),
        h('div', null,
          'This text line is another element inside of an fragment.'),
        h('hr'),
        h('h6', null,
          'A simple fragment test with a select box:'),
        h('select', null, Options())
      )
    );
  })
});

const Options = defineComponent({
  displayName: 'Options',

  main: render(() => {
    return (
      h(Fragment, null,
        h('option', null, 'Option #1' ),
        h('option', null, 'Option #2' ),
        h('option', null, 'Option #3' )));
  })
});

export default {
  title: 'Fragment demo (render)',
  content: FragmentDemo()
};
