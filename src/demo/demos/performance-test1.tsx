import { createElement, defineComponent } from '../../modules/core/main/index'
import { useState, useEffect } from '../../modules/hooks/main/index'
import { div } from '../../modules/html/main/index'
//import React from '../../../node_modules/react/umd/react.production.min'

const h = (window as any).React.createElement

function runTests() {
  const
    iterationCount = 400000,
    tests = []

  let report = ''

  tests.push({
    name: 'Using createElement from React',

    run() {
      for (let i = 0; i < iterationCount; ++i) {
        h('div',
          { className: 'my-class', id: 'my-id' },
          h('div', { className: 'my-class2', id: 'my-id2'}, 'some text', [1, 2, 3, 4, 5]))  
      }
    }
  }),

  tests.push({
    name: 'Using createElement from js-surface',

    run() {
      for (let i = 0; i < iterationCount; ++i) {
        createElement('div',
          { className: 'my-class', id: 'my-id' },
          createElement('div', { className: 'my-class2', id: 'my-id2'}, 'some text', [1, 2, 3, 4, 5]))  
      }
    }
  }),

  tests.push({
    name: 'Using HTML factories',

    run() {
      for (let i = 0; i < iterationCount; ++i) {
        div(
          { className: 'my-class', id: 'my-id' },
          div({ className: 'my-class2', id: 'my-id2'}, 'some text', [1, 2, 3, 4, 5]))  
      }
    }
  })

  for (let i = 0; i < tests.length; ++i) {
    const
      test = tests[i],
      startTime = Date.now()
    
    test.run()

    const
      stopTime = Date.now(),
      duration = (stopTime - startTime) + ' ms'

    const message = `Run time for test '${test.name}': ${duration}`

    if (i == 0) {
      report = message
    } else {
      report += '\n' + message
    }
  }

  report += '\nAll tests finished.'

  return report
}

const PerformanceTest = defineComponent({
  displayName: 'PerformanceTest',

  render() {
    const [report, setReport] = useState(() => null as string)

    useEffect(() => {
      setReport(runTests())
    }, [])

    return (
      <div>
        <h4>Measuring time to build virtual dom trees</h4>
        {
          report === null
            ? <div>Running performance test - please wait...</div>
            : <pre>{report}</pre>
        }
      </div>
    )
  }
})

export default <PerformanceTest/>
