import { defineComponent, mount } from 'js-surface'

import { fragment, Html } from 'js-surface/addons'

const { div, hr, h6, option, select } = Html

const FragmentDemo = defineComponent({
  displayName:  'FragmentDemo',

  render() {
    return (
      fragment(null,
        div(null,
          'This text line is an element inside of an fragment.'),
        div(null,
          'This text line is another element inside of an fragment.'),
        hr(),
        h6(null,
          'A simple fragment test with a select box:'),
        select(null,
          fragment(null,
            Option({ text: 'Option #1' }),
            Option({ text: 'Option #2' }),
            Option({ text: 'Option #3' })))
      )
    )
  }
})

const Option = defineComponent({
  displayName: 'Option',

  properties: {
    text: {
      type: String,
      nullable: true,
      defaultValue: null
    }
  },

  render({ text }) {
    return option(null, text)
  }
})

mount(FragmentDemo(), 'main-content')
