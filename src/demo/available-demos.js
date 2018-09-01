// based just on core
import HelloWorld1 from './core/HelloWorld1'
import SimpleCounter from './core/SimpleCounter'
import ComplexCounter from './core/ComplexCounter'
import I18n from './core/I18n'
import PerformanceTest1 from './core/PerformanceTest1'
import Fragments from './core/Fragments'
import Iterators from './core/Iterators'
import InnerHtml from './core/InnerHtml'

// based on core + classes 
import HelloWorld2 from './classes/HelloWorld2'
import VerySimpleCounter from './classes/VerySimpleCounter'
import Clock from './classes/Clock'
import StopWatch from './classes/StopWatch'
import Contexts from './classes/Contexts'
import Injections from './classes/Injections'
import ErrorBoundaries from './classes/ErrorBoundaries'
import Children from './classes/Children'
import MountUnmount from './classes/MountUnmount'
import PerformanceTest2 from './classes/PerformanceTest2'
import PerformanceTest3 from './classes/PerformanceTest3'

export default [
  ['Hello World 1 (core)', HelloWorld1],
  ['Hello World 2 (classes)', HelloWorld2],
  ['Very simple counter (classes)', VerySimpleCounter],
  ['Simple counter (core)', SimpleCounter],
  ['Complex counter (core)', ComplexCounter],
  ['Stop watch (classes)', StopWatch],
  ['Clock (classes)', Clock],
  ['Performance Test 1 (core)', PerformanceTest1],
  ['Performance Test 2 (classes)', PerformanceTest2],
  ['Performance Test functional (classes)', PerformanceTest3],
  ['Fragments (core)', Fragments],
  ['Iterators (core)', Iterators],
  ['Inner HTML (classes)', InnerHtml],
  ['Contexts (classes)', Contexts],
  ['Injections (classes)', Injections],
  ['Internationalization (core)', I18n],
  ['Error boundaries (classes)', ErrorBoundaries],
  ['Children (classes)', Children],
  ['MountUnmount (classes)', MountUnmount]
].map(([title, content]) => ({ title, content }))
