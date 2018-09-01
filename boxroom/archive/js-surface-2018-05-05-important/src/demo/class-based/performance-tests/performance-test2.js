import Surface from 'js-surface'
import { Html as HtmlReact } from 'js-dom-factories/react'
import { Html as HtmlSurface } from 'js-dom-factories/surface'
import { Html as HtmlUniversal } from 'js-dom-factories/universal'
import reactHyperscript from 'react-hyperscript'

import hyperscriptReact from 'js-hyperscript/react'
import hyperscriptSurface from 'js-hyperscript/surface'
import hyperscriptUniversal from 'js-hyperscript/universal'

const Html =
  Surface.Adapter.name === 'react'
    ? HtmlReact
    : Surface.Adapter.name === 'surface'
    ? HtmlSurface
    : HtmlUniversal

const hyperscript =
  Surface.Adapter.name === 'react'
    ? hyperscriptReact
    : Surface.Adapter.name === 'surface'
    ? hyperscriptSurface
    : hyperscriptUniversal

const
  iterationCount = 100000,
  contentContainer = document.getElementById('main-content'),
  adapterName = Surface.Adapter.name,
  tests = []

let createElement = null
console.log(Surface.adapter)
switch (adapterName) {
case 'react':
  createElement = Surface.Adapter.api.React.createElement
  break

case 'dio':console.log(Surface.Adapter)
  createElement = Surface.Adapter.api.Dio.createElement
  break

case 'surface':
  createElement = Surface.Adapter.api.Surface.createElement
  break
}

contentContainer.innerHTML = 'Please wait - performance stests are running ...'
let report = ''

if (adapterName !== 'vue') {
  tests.push({
    displayName: `Using adapter "${Surface.Adapter.name}"`,

    run() {
      for (let i = 0; i < iterationCount; ++i) {
        createElement('div',
          { className: 'my-class', id: 'my-id' },
          createElement('div', { className: 'my-class2', id: 'my-id2'}, 'my-div', 1, 2, 3, 4, 5));  
      }
    }
  })
}

tests.push({
  displayName: 'Using createElement of "js-surface"',

  run() {
    for (let i = 0; i < iterationCount; ++i) {
      Surface.createElement('div',
        { className: 'my-class', id: 'my-id' },
        Surface.createElement('div', { className: 'my-class2', id: 'my-id2'}, 'my-div', 1, 2, 3, 4, 5));  
    }
  }
})

tests.push({
  displayName: 'Using "js-hyperscript" (test 1)',

  run() {
    for (let i = 0; i < iterationCount; ++i) {
      hyperscript('div',
        { className: 'my-class', id: 'my-id' },
        hyperscript('div', { className: 'my-class2', id: 'my-id2'}, 'my-div', 1, 2, 3, 4, 5));  
    }
  }
})

tests.push({
  displayName: 'Using "js-hyperscript" (test 2)',

  run() {
    for (let i = 0; i < iterationCount; ++i) {
      hyperscript('#my-id', { className: 'my-class' },
        hyperscript('#my-id2', { className: 'my-class2' }, 'my-div', 1, 2, 3, 4, 5));  
    }
  }
})

tests.push({
  displayName: 'Using "js-hyperscript" (test 3)',

  run() {
    for (let i = 0; i < iterationCount; ++i) {
      hyperscript('#my-id.my-class > #my-id2.my-class2', 'my-div', 1, 2, 3, 4, 5)
    }
  }
})

if (adapterName === 'react') {
  tests.push({
    displayName: 'Using "react-hyperscript (test 1)"',

    run() {
      for (let i = 0; i < iterationCount; ++i) {
        reactHyperscript('div', { className: 'my-class', id: 'my-id' }, [
          reactHyperscript('div', { className: 'my-class2', id: 'my-id2'}, ['my-div', 1, 2, 3, 4, 5])
        ]);  
      }
    }
  })

  tests.push({
    displayName: 'Using "react-hyperscript (test 2)"',

    run() {
      for (let i = 0; i < iterationCount; ++i) {
        reactHyperscript('#my-id', { className: 'my-class' }, [
          reactHyperscript('#my-id2', { className: 'my-class2' }, ['my-div', 1, 2, 3, 4, 5])
        ])
      }
    }
  })
}

tests.push({
  displayName: 'Using "js-dom-factories"',

  run() {
    for (let i = 0; i < iterationCount; ++i) {
      Html.div({ className: 'my-class', id: 'my-id' },
        Html.div({ className: 'my-class2', id: 'my-id2'}, 'my-div', 1, 2, 3, 4, 5));   
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
    report += '<br/>' + message
  }
}

report += '<br/><br/>All tests finished.'
contentContainer.innerHTML = report
