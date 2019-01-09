import { VirtualElement } from '../modules/core/main/index'
import helloWorld from './demos/hello-world'
import simpleCounter from './demos/simple-counter'
import simpleCounterAlt from './demos/simple-counter-alt'
import i18n from './demos/i18n'
import iterators from './demos/iterators'
import performanceTest2 from './demos/performance-test2'

const demos: [string, VirtualElement][] = [
  ['Hello world', helloWorld],
  ['Simple counter', simpleCounter],
  ['Simple counter (alternative)', simpleCounterAlt],
  ['Internatinalization', i18n],
  ['Iterators', iterators],
  ['Performance test 2', performanceTest2]
]

export default demos
