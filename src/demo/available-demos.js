// based just on core
import HelloWorld1 from './core/HelloWorld1';
import SimpleCounter from './core/SimpleCounter';
import ComplexCounter from './core/ComplexCounter';
import PerformanceTest1 from './core/PerformanceTest1';
import I18n from './core/I18n';

// based on addons 
import HelloWorld2 from './addons/HelloWorld2';
import VerySimpleCounter from './addons/VerySimpleCounter';
import Clock from './addons/Clock';
import StopWatch from './addons/StopWatch';
import Fragments from './addons/Fragments';
import Iterators from './addons/Iterators';
import InnerHtml from './addons/InnerHtml';
import Contexts from './addons/Contexts';
import PerformanceTest2 from './addons/PerformanceTest2';
import Injections from './addons/Injections';
import ErrorBoundaries from './addons/ErrorBoundaries';

export default [
  ['Hello World 1', HelloWorld1],
  ['Hello World 2', HelloWorld2],
  ['Very simple counter', VerySimpleCounter],
  ['Simple counter', SimpleCounter],
  ['Complex counter', ComplexCounter],
  ['Stop watch', StopWatch],
  ['Clock', Clock],
  ['Performance Test 1', PerformanceTest1],
  ['Performance Test 2', PerformanceTest2],
  ['Fragments', Fragments],
  ['Iterators', Iterators],
  ['Inner Html', InnerHtml],
  ['Contexts', Contexts],
  ['Injections', Injections],
  ['Internationalization', I18n],
  ['Error boundaries', ErrorBoundaries],
].map(([title, content]) => ({ title, content }));
