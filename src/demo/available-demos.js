// core
import HelloWorldCore from './core/HelloWorld';
import SimpleCounterCore from './core/SimpleCounter';
import ComplexCounterCore from './core/ComplexCounter';
import PerformanceTest1Core from './core/PerformanceTest1';

// render based
import HelloWorldRender from './render/HelloWorld';
import FragmentsRender from './render/Fragments';

// class based
import HelloWorldClass from './class/HelloWorld';
import ContextsClass from './class/Contexts';
import PerformanceTest2Class from './class/PerformanceTest2';
import InjectionsClass from './class/Injections';

export default [
  HelloWorldCore,
  HelloWorldRender,
  HelloWorldClass,
  SimpleCounterCore,
  ComplexCounterCore,
  PerformanceTest1Core,
  PerformanceTest2Class,
  FragmentsRender,
  ContextsClass,
  InjectionsClass
];
