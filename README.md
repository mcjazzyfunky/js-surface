# js-surface

Research project to evaluate and implement a working UI library abstraction API
*js-surface* aims to be itself a full-featured UI library (using Dyo under the hood)
and also provides the possibility to implement real React and also real Preact
components with the same API.

[![Licence](https://img.shields.io/badge/licence-LGPLv3-blue.svg?style=flat)](https://github.com/js-works/js-spec/blob/master/LICENSE)
[![npm version](https://img.shields.io/npm/v/js-surface.svg?style=flat)](https://www.npmjs.com/package/js-surface)
[![Build status](https://travis-ci.com/js-works/js-surface.svg)](https://travis-ci.org/js-works/js-surface)
[![Coverage status](https://coveralls.io/repos/github/js-works/js-surface/badge.svg?branch=master)](https://coveralls.io/github/js-works/js-surface?branch=master)

**Remark: This README document is just an early draft - totally incomplete yet**

### Installation

```
# To download project and dependences
git clone https://github.com/js-works/js-surface.git
cd js-surface
npm install

# To run tests
npm run test

# To run tests with watching
npm run test-watch

# To start the demos
npm run demo

# To build the project
npm run build

# To build and prepare the project for publishing
npm run dist
```

### Introduction

js-surface is a R&D project to find a pragmatic API that can be used
as wrapper API for the actual React, Preact and Dyo APIs with the goal to 
provide a general API that can be used to write Preact, React and lightweight
Dyo-based components
Be aware that jsSurface is actually only for research purposes, it's currently
NOT meant to be used in real-world applications.

First, here's a small demo application to get a glimpse of how components
are currently implemented with jsSurface:

#### Hello world component

```jsx
// import from 'js-surface/react' if you want to use React
// under the hood (otherwise a completely wrapped verision of
// Dyo will be used)
import { h, component, render } from 'js-surface'

const HelloWorld = component({
  name: 'HelloWorld',

  main({ name = 'World' }) {
    return div(`Hello, ${name}!`)
  }
})

// Also the following short syntax is supported:

const HelloWorld2 = component('HelloWorld', props => 
  <div>Hello ${props.name}</div>
)

render(<HelloWorld/>, 'app')
```

#### Simple counter

```jsx
import { h, component, render, useCallback, useState } from 'js-surface/react'

// 3rd-party general purpose validation library
import * as Spec from 'js-spec/validators' 

const Counter = component({
  name: 'Counter',

  validate: Spec.checkProps({
    optional: {
      initialValue: Spec.integer,
      label: Spec.string
    }
  }),

  main({ initialValue = 0, label = 'Counter' }) {
    const
      [count, setCount] = useState(initialValue),
      onIncrement = useCallback(() => setCount(it => it + 1), [])

    return (
      <div>
        <label>{label}</label>
        <button onClick={onIncrement}>{count}</button>
      </div>
    )
  }
})

render(<Counter/>, 'app')
```

In case you are using *ESLint* with *eslint-plugin-react-hooks*, the linter
will not like the usage above (due to the lowercase first letter of function
`main`). That's why the preferred way to define components is the
following:

```javascript
const Counter = component({
  name: 'Counter',

  validate: Spec.checkProps({
    optional: {
      initialValue: Spec.integer,
      label: Spec.string
    }
  }),

  main: CounterView
})

function CounterView({ initialValue = 0, label = 'Counter' }) {
  const
    [count, setCount] = useState(initialValue),
    onIncrement = useCallback(() => setCount(it => it + 1))

  return (
    <div>
      <label>{label}</label>
      <button onClick={onIncrement}>{count}</button>
    </div>
  )
}
```

### Motivation

* Use the same code to implement React, Preact and js-surface components.
  Write a component and decide at build time what UI library shall be
  used (depending on the complexity of your components, it's possible that
  conditional compilation/inclues/excludes will be necessary)

* Reacts provides the possibility for a sophisticated validation of the
  components' properties, which is great.
  Normally for that purpose a add-on library called "props-types".
  While it's great that "props-types" is not part of React itself, yet
  unfortunatelly all the validation function of "props-types" are only
  meant to be used with React, it's not meant as a general purpose validation
  library as the signature of the validation functions are very React-specific.
  This has some advantages of course (maybe shorter error messages and a bit
  smaller production bundle sizes) but the disadvantage that you cannot just use
  a general purpose validation library are really heavy.
  jsSurface on the other hand allows the use of such general-purpose validation
  libraries - while it recommended to use the jsSurface independent validation
  library ["js-spec"](https://github.com/js-works/js-spec).

### Current API (not complete yet)

#### Module "_js-surface_"

Basics:
* `h(type, props?, ...children)`
* `component(componentConfig)` or `component(name, main)`
* `context(contextConfig)`
* `render(content, container)` - if content is null then unmount
* `Fragment`
* `Boundary`

Hooks:
* `useCallback(callback)`
* `useContext(ctx)`
* `useEffect(action, dependencies?)`
* `useForceUpdate()`
* `useImperativeHandle(ref, getter, inputs)`
* `usePrevious(value)`
* `useRef(initialValue)`
* `useState(initialValue or getInitialValue)`

Helper functions for virtual elements and nodes
* `isElement(it)`
* `isNode(it)`
* `typeOf(element)`
* `propsOf(element)`
* `cloneElement(element, props, ...children)`
* `setInnerHtml(element, html)`

Helper functions for children
* `childCount(children)`
* `forEachChild(children, action)`
* `mapChildren(children, mapper)`
* `onlyChild(children)`
* `toChildArray(children)`
* `withChildren(func)`

### Project status

**Important**: This project is in a early alpha state.
