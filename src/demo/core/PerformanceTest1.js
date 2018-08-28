import { createElement, defineComponent } from 'js-surface'
import { Component } from 'js-surface/common'
import { h } from 'preact'

function runTests() {
  const
    iterationCount = 100000,
    tests = []

  let report = ''

  tests.push({
    displayName: 'Using createElement of "js-surface"',

    run() {
      for (let i = 0; i < iterationCount; ++i) {
        createElement('div',
          { className: 'my-class', id: 'my-id' },
          createElement('div', { className: 'my-class2', id: 'my-id2'}, 'my-div', 1, 2, 3, 4, 5))  
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

    const message = `Run time for test '${test.displayName}': ${duration}`

    if (i == 0) {
      report = message
    } else {
      report += '\n' + message
    }
  }

  report += '\nAll tests finished.'
  
  return report
}

const Test1 = defineComponent({
  displayName: 'Test1',

  main: class extends Component {
    componentDidMount() {
      this.report = runTests()
      this.forceUpdate()
    }

    render() {
      return h('pre', null, this.report)
    }
  }
})

export default createElement(Test1)
