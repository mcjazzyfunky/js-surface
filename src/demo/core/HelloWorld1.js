import { defineComponent } from 'js-surface'
import { Html } from 'js-surface/dom-factories'

const { div } = Html

const HelloWorld = defineComponent({
  displayName: 'HelloWorld',

  properties: {
    name: {
      type: String,
      defaultValue: 'World'
    }
  },

  render({ name }) {
    return div(`Hello ${name}!`)
  }
})

export default HelloWorld({ name: 'Jane Doe' })
