import { createElement, component } from '../../modules/core/main/index'

type HelloWorldProps = {
  name?: string
}

const HelloWorld: any = component<HelloWorldProps>({ // TODO
  displayName: 'HelloWorld',

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
