import { createElement, component } from '../../main/index'
import { Spec } from 'js-spec'

type HelloWorldProps = {
  name?: string
}

const HelloWorld: any = component<HelloWorldProps>({ // TODO
  displayName: 'HelloWorld',

  validate: Spec.checkProps({
    optional: {
      name: Spec.string
    }
  }),

  render({ name = 'world' }) {
    return `Hello, ${name}!`
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
