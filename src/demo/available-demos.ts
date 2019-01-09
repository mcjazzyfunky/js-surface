import { VirtualElement } from '../modules/core/main/index'
import helloWorld from './demos/hello-world'
import simpleCounter from './demos/simple-counter'
import simpleCounterAlt from './demos/simple-counter-alt'
import complexCounter from './demos/complex-counter'
import stopWatch from './demos/stop-watch'
import fragments from './demos/fragments'
import clock from './demos/clock'
import i18n from './demos/i18n'
import iterators from './demos/iterators'
import mousePositionHook from './demos/mouse-position-hook'
import performanceTest1 from './demos/performance-test1'
import performanceTest2 from './demos/performance-test2'

const demos: [string, VirtualElement][] = [
  ['Hello world', helloWorld],
  ['Simple counter', simpleCounter],
  ['Simple counter (alternative)', simpleCounterAlt],
  ['Complex counter', complexCounter],
  ['Stop watch', stopWatch],
  ['Fragments', fragments],
  ['Clock', clock],
  ['Internationalization', i18n],
  ['Iterators', iterators],
  ['Mouse position hook', mousePositionHook],
  ['Performance test 1', performanceTest1],
  ['Performance test 2', performanceTest2]
]

export default demos
