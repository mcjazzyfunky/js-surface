// based just on core
import HelloWorld1 from './core/HelloWorld1';
import SimpleCounter from './core/SimpleCounter';
import ComplexCounter from './core/ComplexCounter';
import I18n from './core/I18n';
import PerformanceTest1 from './core/PerformanceTest1';
import PerformanceTest2 from './common/PerformanceTest2';


// based on core + common 
import HelloWorld2 from './common/HelloWorld2';
import VerySimpleCounter from './common/VerySimpleCounter';
import Clock from './common/Clock';
import StopWatch from './common/StopWatch';
import Fragments from './common/Fragments';
import Iterators from './common/Iterators';
import InnerHtml from './common/InnerHtml';
import Contexts from './common/Contexts';
import Injections from './common/Injections';
import ErrorBoundaries from './common/ErrorBoundaries';

export default [
  ['Hello World 1 (core)', HelloWorld1],
  ['Hello World 2 (common)', HelloWorld2],
  ['Very simple counter (common)', VerySimpleCounter],
  ['Simple counter (core)', SimpleCounter],
  ['Complex counter (core)', ComplexCounter],
  ['Stop watch (common)', StopWatch],
  ['Clock (common)', Clock],
  ['Performance Test 1 (core)', PerformanceTest1],
  ['Performance Test 2 (common)', PerformanceTest2],
  ['Fragments (common)', Fragments],
  ['Iterators (common)', Iterators],
  ['Inner HTML (common)', InnerHtml],
  ['Contexts (common)', Contexts],
  ['Injections (common)', Injections],
  ['Internationalization (core)', I18n],
  ['Error boundaries (common)', ErrorBoundaries],
].map(([title, content]) => ({ title, content }));
