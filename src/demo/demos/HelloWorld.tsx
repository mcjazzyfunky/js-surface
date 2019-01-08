/* @jsx createElement */
import { createElement, defineComponent } from '../../modules/core/main/index'
import { div } from '../../modules/html/main/index'

interface HelloWorldProps {
  name: string
}

const HelloWorld = defineComponent<HelloWorldProps>({
  displayName: 'HelloWorld',

  properties: {
    name: {
      type: String,
      defaultValue: 'world'
    } 
  },

  render(props) {
    return `Hello, ${props.name}!`
  }
})

export default
  div(null,
    div(null,
      HelloWorld()),
    div(null,
      HelloWorld({ name: 'Jane Doe' })))
