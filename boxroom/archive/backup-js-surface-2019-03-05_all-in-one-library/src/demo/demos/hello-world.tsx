import { createElement, defineComponent } from '../../modules/core/main/index'

type HelloWorldProps = {
  name?: string
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
  <div>
    <div>
      <HelloWorld/>
    </div>
    <div>
      <HelloWorld name="Jane Doe"/>
    </div>
  </div> 
