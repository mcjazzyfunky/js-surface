# jsSurface

Research project to evaluate and implement a working UI library abstraction API. 

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

jsSurface is a R&D project to find a pragmatic API that can be used
as wrapper API for the actual React and Dyo APIs with the goal to 
provide a general API that can be used to write React, Preact and Dyo
components.
Be aware that jsSurface is actually only for research purposes, it's currently
NOT meant to be used in real-world applications.

First, here's a small demo application to get a glimpse of how components
are currently implemented with jsSurface:

#### Hello world component

```jsx
import { createElement, component, mount } from 'js-surface'
import 'js-surface/adapt-react' // to use React under the hood

const HelloWorld = component({
  displayName: 'HelloWorld',

  render({ name = 'World' }) {
    return div(`Hello, ${name}!`)
  }
})

// Also the following short syntax is supported:

const HelloWorld2 = component('HelloWorld', props => 
  <div>Hello ${props.name}</div>
)


mount(<HelloWorld/>, 'app')
```

#### Simple counter

```jsx
import { createElement, component, mount, useCallback, useState } from 'js-surface'
import 'js-surface/adapt-react' // to use React under the hood

// A 3rd-party general purpose validation library.
import { Spec } from 'js-spec'; 

const Counter = component({
  displayName: 'Counter',

  validate: Spec.checkProps({
    optional: {
      initialValue: Spec.integer,
      label: Spec.string
    }
  }),

  render({ initialValue = 0, label = 'Counter' }) {
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
})

mount(<Counter/>, 'app')
```

In case you are using *ESLint* with *eslint-plugin-react-hooks*, the linter
will not like the usage above (due to the lowercase first letter of function
`render`). That's why the preferred way to define components is the
following:

```javascript
const Counter = component({
  displayName: 'Counter',

  validate: Spec.checkProps({
    optional: {
      initialValue: Spec.integer,
      label: Spec.string
    }
  }),

  render: CounterView
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

* Use the exact same code to implement both React and Dyo component.
  Write a component and decide at build time what UI library shall be
  used

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
* `createElement(type, props?, ...children)`
* `component(componentConfig)` or `component(dispayName, renderer, componentOptions?)`
* `context(contextConfig)` or `context(displayName, defaultValue?, contextOptions?)`
* `mount(content, container)`
* `unmount(container)`
* `Fragment`
* `Boundary`

Hooks:
* `useCallback(callback)`
* `useContext(ctx)`
* `useEffect(action, dependencies?)`
* `useForceUpdate()`
* `useMethods(ref, getter, inputs)`
* `usePrevious(value)`
* `useRef(initialValue)`
* `useState(initialValue | initialValueProvider)`

Helper functions for virtual elements and nodes
* `isElement(it)`
* `isNode(it)`
* `propsOf(element)`
* `typeOf(element)`

Helper functions for children
* `childCount(children)`
* `forEachChild(children, callback)`
* `mapChildren(children, mapper)`
* `onlyChild(children)`
* `toChildArray(element)`
* `withChildren(f)`

### Project status

**Important**: This project is in a early alpha state.
