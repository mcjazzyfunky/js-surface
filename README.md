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

jsSurface is a long-term R&D project to find a pragmatic
set of functions to build a common API on top of some popular virtual DOM
based UI libraries (currently React and Dyo).
Be aware that jsSurface is actually only for research purposes, it's currently
NOT meant to be used in real-world applications (and most propably never will).

First, here's a small demo application to get a glimpse of how components
are currently implemented with jsSurface:

#### Hello world component (pure ECMAScript)

```jsx
import { defineComponent, mount } from 'js-surface'
import 'js-surface/adapt-react' // to use React under the hood

// just if you do not want to use JSX, of course JSX is also fully supported
import { div } from 'js-surface/html'

const HelloWorld = defineComponent({
  displayName: 'HelloWorld',

  defaultProps: {
    name: 'world'
  }

  render(props) {
    return div(`Hello, ${props.name}!`)
  }
})

mount(HelloWorld(), 'app')
```

#### Simple counter (using hook API and JSX)

```jsx
import { createElement, defineComponent, mount, useCallback, useState } from 'js-surface'
import 'js-surface/adapt-dyo' // to use Dyo under the hood

// A 3rd-party general purpose validation library.
import { Spec } from 'js-spec'; 

const Counter = defineComponent({
  displayName: 'Counter',

  // if you do not want property validation, the following "properties" 
  // parameter can easily be replaced by a simple "defaultProps" configuration
  // (see example below)
  properties: {
    initialValue: {
      type: Number,
      validate: Spec.integer, // using a third-party spec library
      defaultValue: 0
    }, 

    label: {
      type: String,
      defaultValue: 'Counter'
    }
  },

  render(props) {
    const
      [count, setCount] = useState(),
      onIncrement = useCallback(() => setCount(count + 1))

      return (
        <div>
          <label>{props.label}</label>
          <button onClick={onIncrement}>{count}</button>
        </div>
      )
    }
  }
})

mount(<Counter/>, 'app')
```

### Motivation

What are the main difference to React's API?

* React's API is quite "optimized" for the use of JSX:

  While the following JSX syntax is really nice...

  ```jsx
  <FancyHeader>Some headline</FancyHeader>
  ```
  ... its non-JSX counterpart looks quite verbose ...

  ```javascript
  React.createElement(FancyHeader, null, 'Some headline')
  ```

  ... while it would be much nicer just to write ...
  
  ```javascript
  FancyHeader('Some headline')
  ```

  Be aware that you should ALWAYS use JSX with TypeScript
  the non-JSX usage is only meant for those who want to
  UIs in pure ECMAScript.

  In React's API, the main representation of component types are
  render functions (for function components) or component classes.
  Neither will component classes be instantiated by the user directly
  nor will render functions be called directly. The only useful
  usage of component types are that they will be passed as first argument to
  the `React.createElement` function. Same for context provider
  and consumers and the `Fragment` symbol.

  In jsSurface things are different: Everything that can be used as first
  argument of the `createElement` function besides strings is a factory
  function that returns the result of a corresponding `createElement` call.
  Besides the second argument (`props`) of the `createElement` function
  and also for all the component factories is optional to provide a concice
  syntax: All component types, `Fragment`, context providers, context
  consumers are factory functions with an optional second `props` argument:

  ```jsx
  SomeComponent('some text')

  // or when using jsSurface with JSX
  <SomeComponent>Some text</SomeComponent>
  ```

  ```jsx
  Fragment(
    SomeComponent('some text'),
    SomeComponent({ className: 'some-class'}, 'some text'))

  // or when using jsSurface with JSX
  <>
    <SomeComponent>Some text</SomeComponent>
    <SomeComponent className="some-class">some text</SomeComponent>
  </>
  ```
  
  ```jsx
  Fragment({ key: someKey },
    SomeComponent(),
    SomeOtherComponent())
  
  // or when using jsSurface with JSX
  <Fragment key={someKey}>
    <SomeComponent/>
    <SomeOtherComponent/>
  </>
  ```

  ```jsx
  SomeCtx.Provider({ value: someValue },
    SomeComponent(),
    SomeOtherComponent())
  
  // or when using jsSurface with JSX
  <SomeCtx.Provider value={someValue}>
    <SomeComponent/>
    <SomeOtherComponent/>
  </SomeCtx.Provider>
  ```

  ```jsx
  SomeCtx.Consumer(value =>
    SomeComponent(value))
  
  // or when using jsSurface with JSX
  <SomeCtx.Consumer>
    { it => <SomeComponent/> }
  </SomeCtx.Consumer>
  ```

* In React a virtual element is represented by an object of shape
  `{ $$typeof, type, props, key, ref, ... }`.
  To access `type` or `props` of a virtual elements you have to use
  `elem.type` and `elem.props`.<br>
  In js-surface on the other hand a virtual element is considered
  an opaque data structure. To access `type` and `props` of a virtual
  element you have to use `typeOf(elem)` and `propsOf(elem)`.

* In React the property `children` of `props` is a opaque datastructure.
  To handle that React provides a singleton Object called `Children`
  that provides some helper functions to work with `children`
  (`Children.map`, `Children.forEach`, `Children.count` etc.).<br>
  In js-surface `children` are also represented as a opaque data
  structure. Similar to React, js-surface also has several helper functions
  to work with `children` (`mapChildren`, `forEachChild`, `childCount` etc.)

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

* In jsSurface component types are represented by a corresponding factory
  function (that does create a virtual element by using the `createElement` function).
  That's simplifies the implemention of user interfaces in pure ECMAScript
  if desired - nevertheless it is recommended to use JSX as this is the
  de-facto standard in React-like UI development.

### Current API (not complete yet)

#### Module "_js-surface_"

Basics:
* `createElement(type, props?, ...children)`
* `defineComponent(componentConfig)`
* `defineContext(contextConfig)`
* `h(type, props?, ...children)`
* `mount(content, container)`
* `unmount(container)`
* `Fragment(props?, ...children)`

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

#### Module "_js-surface/html_"

Factory functions for all HTML entities (to be used in non-JSX context: `div('some text')`)

#### Module "_js-surface/svg_"

Factory functions for all SVG entities

### Project status

**Important**: This project is in a very early state and it is not meant 
to be used in production.
