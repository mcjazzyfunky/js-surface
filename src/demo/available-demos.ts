import { VirtualElement } from '../modules/core/main/index'
import helloWorld from './demos/hello-world'
import simpleCounter from './demos/simple-counter'
import simpleCounterAlt from './demos/simple-counter-alt'
import complexCounter from './demos/complex-counter'
import stopWatch from './demos/stop-watch'
import fragments from './demos/fragments'
import i18n from './demos/i18n'
import iterators from './demos/iterators'
import performanceTest from './demos/performance-test'

const demos: [string, VirtualElement][] = [
  ['Hello world', helloWorld],
  ['Simple counter', simpleCounter],
  ['Simple counter (alternative)', simpleCounterAlt],
  ['Complex counter', complexCounter],
  ['Stop watch', stopWatch],
  ['Fragments', fragments],
  ['Internationalization', i18n],
  ['Iterators', iterators],
  ['Performance test', performanceTest]
]

export default demos
