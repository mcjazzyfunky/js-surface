import { h, component } from '../../main/index'
import * as Spec from 'js-spec/validators'

const HelloWorld = component({
  name: 'HelloWorld',

  validate: Spec.checkProps({
    optional: {
      name: Spec.string
    }
  }),

  main({ name = 'world' }) {
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
