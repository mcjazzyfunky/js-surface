// based just on core
import HelloWorld1 from './core/HelloWorld1';
import SimpleCounter from './core/SimpleCounter';
import ComplexCounter from './core/ComplexCounter';
import PerformanceTest1 from './core/PerformanceTest1';

// based on addons 
import HelloWorld2 from './addons/HelloWorld2';
import Fragments from './addons/Fragments';
import Contexts from './addons/Contexts';
import PerformanceTest2 from './addons/PerformanceTest2';
import Injections from './addons/Injections';

export default [
  ['Hello World 1', HelloWorld1],
  ['Hello World 2', HelloWorld2],
  ['Simple Counter', SimpleCounter],
  ['Complex Counter', ComplexCounter],
  ['Performance Test 1', PerformanceTest1],
  ['Performance Test 2', PerformanceTest2],
  ['Fragments', Fragments],
  ['Contexts', Contexts],
  ['Injections', Injections]
].map(([title, content]) => ({ title, content }));
