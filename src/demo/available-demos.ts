import { VirtualElement } from '../modules/core/main/index'
import HelloWorld from './demos/HelloWorld'
import SimpleCounter from './demos/SimpleCounter'
import SimpleCounterAlt from './demos/SimpleCounterAlt'

const demos: [string, VirtualElement][] = [
  ['Hello world', HelloWorld],
  ['Simple counter', SimpleCounter],
  ['Simple counter (alternative)', SimpleCounterAlt]
]

export default demos
