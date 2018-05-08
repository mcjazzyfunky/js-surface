import { createElement } from 'js-surface';
import hyperscript from 'js-hyperscript/surface';
//import { Html } from 'js-dom-factories/surface';

function runTests() {
  const
    iterationCount = 100000,
    contentContainer = document.getElementById('main-content'),
    tests = [];

  contentContainer.innerHTML = 'Please wait - performance stests are running ...';
  let report = '';

  tests.push({
    displayName: 'Using createElement of "js-surface"',

    run() {
      for (let i = 0; i < iterationCount; ++i) {
        createElement('div',
          { className: 'my-class', id: 'my-id' },
          createElement('div', { className: 'my-class2', id: 'my-id2'}, 'my-div', 1, 2, 3, 4, 5));  
      }
    }
  });

  tests.push({
    displayName: 'Using "js-hyperscript" (test 1)',

    run() {
      for (let i = 0; i < iterationCount; ++i) {
        hyperscript('div',
          { className: 'my-class', id: 'my-id' },
          hyperscript('div', { className: 'my-class2', id: 'my-id2'}, 'my-div', 1, 2, 3, 4, 5));  
      }
    }
  });

  tests.push({
    displayName: 'Using "js-hyperscript" (test 2)',

    run() {
      for (let i = 0; i < iterationCount; ++i) {
        hyperscript('#my-id', { className: 'my-class' },
          hyperscript('#my-id2', { className: 'my-class2' }, 'my-div', 1, 2, 3, 4, 5));  
      }
    }
  });

  tests.push({
    displayName: 'Using "js-hyperscript" (test 3)',

    run() {
      for (let i = 0; i < iterationCount; ++i) {
        hyperscript('#my-id.my-class > #my-id2.my-class2', 'my-div', 1, 2, 3, 4, 5);
      }
    }
  });

  /*
  tests.push({
    displayName: 'Using "js-dom-factories"',

    run() {
      for (let i = 0; i < iterationCount; ++i) {
        Html.div({ className: 'my-class', id: 'my-id' },
          Html.div({ className: 'my-class2', id: 'my-id2'}, 'my-div', 1, 2, 3, 4, 5));   
      }
    }
  });
  */

  for (let i = 0; i < tests.length; ++i) {
    const
      test = tests[i],
      startTime = Date.now();
    
    test.run();

    const
      stopTime = Date.now(),
      duration = (stopTime - startTime) + ' ms';

    const message = `Run time for test '${test.displayName}': ${duration}`;

    if (i == 0) {
      report = message;
    } else {
      report += '\n' + message;
    }
  }

  report += '\nAll tests finished.';
  
  return report;
}

const report = runTests();

export default {
  title: 'Performance test 2',
  content: createElement('pre', report) 
};