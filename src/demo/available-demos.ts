import { VirtualElement } from '../modules/core/main/index'
import HelloWorld from './demos/HelloWorld'
import SimpleCounter from './demos/SimpleCounter'

const demos: [string, VirtualElement][] = [
  ['Hello world', HelloWorld],
  ['Simple counter', SimpleCounter]
]

export default demos
