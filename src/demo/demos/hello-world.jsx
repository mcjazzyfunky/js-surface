import { h, component } from '../../main/index'
import { Spec } from 'js-spec'

const HelloWorld = component({
  displayName: 'HelloWorld',

  validate: Spec.checkProps({
    optional: {
      name: Spec.string
    }
  }),

  render({ name = 'world' }) {
    return <div>Hello, {name}!</div>
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
