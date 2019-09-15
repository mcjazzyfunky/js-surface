import helloWorld from './demos/hello-world'
import simpleCounter from './demos/simple-counter'
import complexCounter from './demos/complex-counter'
import stopWatch from './demos/stop-watch'
import fragments from './demos/fragments'
import innerHtml from './demos/inner-html'
import clock from './demos/clock'
import context from './demos/context'
import i18n from './demos/i18n'
import iterators from './demos/iterators'
import mousePositionHook from './demos/mouse-position-hook'
import mountUnmount from './demos/mount-unmount'
import errorBoundary from './demos/error-boundary'
import performanceTest1 from './demos/performance-test1'
import performanceTest2 from './demos/performance-test2'

const demos = [
  ['Hello world', helloWorld],
  ['Simple counter', simpleCounter],
  ['Complex counter', complexCounter],
  ['Stop watch', stopWatch],
  ['Fragments', fragments],
  ['innerHTML', innerHtml],
  ['Clock', clock],
  ['Context', context],
  ['Internationalization', i18n],
  ['Iterators', iterators],
  ['Mouse position hook', mousePositionHook],
  ['Mount/Unmout', mountUnmount],
  ['Error boundary', errorBoundary],
  ['Performance test 1', performanceTest1],
  ['Performance test 2', performanceTest2]
]

export default demos
