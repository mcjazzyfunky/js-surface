# jsSurface

jsSurface is a long-term R&D project to find a minimalistic but still pragmatic
set of functions to build a base API for UI development.
It also provides a reference implementation of that API (internally
based on "react" and "react-dom").
Be aware that jsSurface is currently only for research purposes, it's currently
NOT meant to be used in real-world applications.

You may ask: What's wrong with the original React API - React's API
itself does only consist of a few functions and classes, isn't that minimal
enough?

This question will be answered below.
But first, here's a small demo application to get a glimpse of how components
are implemented with jsSurface (it's a simple "Counter" application):

```javascript
import { createElement as h, defineComponent, mount } from 'js-surface';
import { view, Component } from 'js-surface/common';
// Be aware that "view" and "Component" are just changeable add-ons to
// jsSurface - means, they are just some kind of syntactical sugar.
import { Spec } from 'js-spec'; // a 3rd-party general purpose validation library

const Counter = defineComponent({
  displayName: 'Counter',

  properties: {
    initialValue: {
      type: Number,
      constraint: Spec.integer, // using a third-party spec library
      defaultValue: 0
    }
  },

  main: class extends Component {
    constructor(props) {
      super(props);
      this.state = { counter: props.initialValue };
      this.onIncrementClick = this.onIncrementClick.bind(this);
    }

    onIncrementClick() {
      this.setState(state => ({ counter: state.counter + 1 }));
    }

    render() {
      return (
        h('button',
          { onClick: this.onIncrementClick },
          'Counter: ' + this.state.counter)
      );
    }
  }
});

const Demo = defineComponent({
  displayName: 'Demo',

  main: view(() => {
    return (
      h('div',
        h('div', 'Please press the button to increase the counter'),
        Counter())
    );
  })
});

mount(Demo(), 'main-content');
```

Now to the questions why React's API seems a bit suboptimal (be aware that
the author of jsSurface is a very big fan of React, and thinks that
React is really one the most ground-breaking libraries in UI development,
in fact jsSurface is highly based on React's achievements -
so please see the following comments as well-meant proposals for React's
long-term evolution):

* React's API is quite "optimized" for the use of JSX:

  While the following JSX syntax is really nice...

  ```html
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

  The problem here with React's API is, that the main representation of
  component types are component classes and (for simple components) render
  functions.
  Neither will component classes be instantiated by the user directly
  nor will the render functions be called directly. The only useful
  usage of component types are that they will be passed as first argument to
  the `React.createElement` function. The same problem you have with
  context providers and consumers and the `Fragment` symbol.

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
* React is quite opinonated about the way that complex components shall be
  implemented.
  The fact that complex component types are represented by extensions of
  React's Component class shows that this class-based approach is the prefered
  way of UI programming in React. Even if you like to use other approaches
  (like for example some functional styles) you still have to map every
  other component type implementation approach to React's component class.

  jsSurface on the other hand is not opinionated at all about the way components
  shall be implemented. A jsSurface component definition consists of some
  component meta information (like display name or declaration of the property
  types) plus one single descriptor called the `main` descriptor which describes
  the complete behavior of the component.

  As you may guess, that `main` descriptor is not really very handy to
  be implemented. But be aware that you will normally not implement that
  `main` descriptor directly but use some custom helper functions of your
  choice to make that implementation much easiser.
  So the component programming paradigm is completely separated from jsSurface
  itself.
  Nevertheless using React's Component class provides a very nice way to
  implement components. Therefore the jsSurface package is bundles with an
  additional package calles 'js-surface/common' which has also a Component class
  with the exact same API as the React counterpart.
  But be aware this Component class is just an out-of-the-box add-on for
  convenience jsSurface does NOT depend on this add-on package at all.

* React handles ```props.children``` in a quite awkward way:<br>
  If there's only one children ```props.children``` is not an one-element
  array but the child itself.<br>
  This is handled differently in jsSurface:<br>
  If there are one ore more children then ```props.children``` will always be
  an array in jsSurface.

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

* The React API lacks a bit of information hiding:
  As for complex components you always have the underlying component class
  or in case of references even the component instance directly, you always have access to a lot of data and methods you do not really need to have access to.
  
  In jsSurface that's different: As component types are only represented by
  a corresponding factory method (that does only create a virtual element by
  using the `createElement` function) you do NOT have access to the
  underlying component implementation. And also you will never have access to
  the component instance: Refs will not pass the component instance itself as
  it is done with React, but instead will only pass a proxy for the component
  instance which only expose those component functionalities that have
  explicitly defined to be exposed.

**Important**: This project is in a very early state - please do not plan to 
use it for productive projects.

### jsSurface API

Currently jsSurface core API consists of nine functions:

* createElement(type, props?, ...children)
* createPortal(child, container)
* defineComponent(componentConfig)
* defineContext(contextConfig)
* isElement(it)
* isNode(it)
* mount(content, container)
* unmount(container)
* Fragment(props?, ...children)

#### createElement(type, props?, ...children)

`createElement` creates a virtual DOM element basically in the same way like the equally named functions in "React".
The "props" argument is optional.
It results a virtual DOM element that looks like:

{ type, props }

where children (if there are any) are to be found in the `props` object
(be aware that the virtual DOM elements are instances of an internal base class,
that means they cannot be created without using `createElement`).

#### isElement(it)

Checks whether `it` is a proper virtual DOM element that has been created
by function `createElement`.
Return true or false.

#### isNode(it)

Checks whether `it` is a valid item for the children arguments for
`createElement`.
Valid nodes are: undefined, null, booleans, number, strings, arrays and other iterables and virtual element that have been ´createElement´.

Return true or false.

#### defineComponent(config): Function

Components are basically defined the folowing way (be aware that you will NOT have to
implement that `main` description object directly - see above counter example):

Stateless functional components:

```javascript
import { createElement as h, defineComponent } from 'js-surface';

export default defineComponent({
  displayName: 'HelloWorldDemo',

  properties: {
    name: {
      type: String,
      defaultValue: 'World' 
    }
  },

  main: {
    functional: true, // indicates a stateless functional component

    render({ name }) {
      return h('div', `Hello ${name}!`);
    }
  }
})
```

Complex components:

```javascript
export default defineComponent({
    displayName: 'DatePicker',

    properties: {
        value: {
            type: Date,
            
            get defaultValue() {
                return new Date(new Date().toDateString())
            }
        },

        name: {
            type: String,
            constraint: Spec.match(/^[a-zA-Z]+$/),
                        // 3rd-party spec lib
            nullable: true,
            defaultValue: null
        }

        Logger: {
            type: Logger,
            inject: LoggerCtx
        },

        onChange: {
            type: Function,
            nullable: true,
            defaultValue: null
        }
    },

    methods: ['focus', 'blur'], // to declare public methods

    // isErrorBoundary: true | false -- not needed in this example

    main: {
      functional: false, // indicates a complex component

      init(getProps, getState, updateState, forceUpdate) {
        // ... sorry, to complicated to show here in detail ....
        // 
        // Arguments:
        //   getProps() returns current props
        //   getState() returns current state (object)
        //   updateState(updater, callback?) updates state (mostly) asynchronously
        //   forceUpdate(callback) Refreshes the component view  
        //
        // Returns: {
        //   render() - renders the content and returns a virtual dom view
        //
        //   beforeUpdate(nextProps, nextState) - will be called before the
        //                                        view will be updated.
        //
        //   afterUpdate(prevProps, prevState) - will be called after the view
        //                                       has been updated
        //
        //   finalize() will be called when the component will be unmounted
        //
        //   proxy - object that has only the public methods (see component
        //           configuration parameter "methods") of the component
        //           as properties
        //
        //   handleError(error, info) will be called if a descendant component
        //                            throws an uncatched error (only needed
        //                            if component configuration parameter
        //                            'isErrorBoundary' is set to true)
        // }
        return {
            render,
            proxy, 
            // [...]
        }
    }
})
```

**Important:

Component configuration parameter "main" can - besides being object of the
form { functional: true | false, ... } - also be a function.
This function then will be called (passing the component configuration
as argument) to determine the main description object
(=> { functional: true | false, ... }).
If that function has itself a function called "normalizeComponent" then the
"normalizeComponent" function will be used instead of the function itself to
determine the main description object.
The reason for that is that this allows to use helper functions or even classes
(classes needs to have a static "normalizeComponent" function) to generate
the actual main description object.


**TODO**: More info will follow...

Returns a component factory to generate corresponding component specific virtual
elements.

**TODO**: The component factory will be enriched with some meta information about the component type with static, readonly property "meta"- details will follow...

### defineContext: config => { Provider, Consumer }

A `defineContext` invocation looks like follows:

```javascript
const MyContext = defineContext({
    displayName: 'MyContext', // for error messages etc.
    type: Number,
    constraint: Spec.oneOf(1, 2, 3, 4, 5) // using a third-party spec library
    defaultValue: 5
});
```

Returns an object that has two properties "Provider" and "Consumer", that are
factories to handle the context.

#### mount: (content, target) => void

Mounts/renders a VDOM tree specified by argument `content` to a real DOM element specified by `target` (either the DOM element itself or the corresponding ID).

#### unmount: target => void

Unmounts a component previously mounted at the specified by `target`
(either the DOM element itself or the corresponding ID).

