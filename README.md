# jsSurface

A UI framework abstraction layer written in ECMAScript 2016.

**Note**: This project is in a very early state - please do not plan use it for productive projects yet.

## Introduction

Developing user interfaces in JavaScript is fun these days.
There are so many great UI libraries and framesworks to chose from: 
React, Vue, Angular, Aurelia, Inferno, Preact etc.

Unfortunatelly, when you implement a suite of components you first have to decide which library/framework to use - your component suite will then only be supported by this particular UI library/framework.

Wouldn't it be better to implement components with help of an API that is independent of the component framework in which the components will run later?

## Goal

jsSurface is a R&D project to investigate what such a UI library agnostic API could look like.
Also it should provide adapters to the the most important "virtual DOM" based UI libraries:

- React
- React Native
- Vue
- Inferno
- Preact
- React Lite

The API of jsSurface is highly based on "virtual DOM" techniques. Unfortunatelly "Angular" and "Aurelia" are not based on virtual DOM diffing, that's why writing an adapter for these two fantastic UI framworks would be much more complicated than for those libraries listed above. Therefore providing support for "Angular" and "Aurelia" is currently not planned for jsSurface - but let's see what future holds.

### Important advance information

jsSurface tries to provide a minimalistic API to describe UI components in a framework-agnostic way.
But that does not mean that componenent developer will directly this minimalistic API.
Instead, to implement complex components you have to use some third-party libraries/APIs that are built upon jsSurface.
For example if you like to implement components in a React-like object-oriented way, then maybe you want try to use the sister-project "jsUnify" (in development - currently in a subfolder of the jsSurface sources).

### jsSurface API

Currently jsSurface API consists of four methods:
"createElement", "isElement", "defineComponent", "mount".

#### createElement(type, props, ...children)

`createElement` creates a virtual DOM element basically in the same way like the equally named functions in "React", "Inferno" and "React-Lite".
In "Preact" the corresponding function is called `h`.
Unfortunatelly "Vue" does not have a global "createElement" counterpart, but only a non-global component "createElement" argument that is provided component-specific by Vue's `render` method. That's why jsSurface provide its own global `createElement` implementation for Vue which generates generic VDOM trees that will later be translated to Vue-specific VDOM tree within the Vue components `render` method.

Returns VDOM tree.

#### isElement(it)

Checks whether `it` is a proper VDOM structure.
Return true or false.

#### defineComponent(config)

jsSurface supports two basic kind of components: simple *functional (stateless) components* and more complex *standard components*

Please find here a description about the difference:
https://javascriptplayground.com/blog/2017/03/functional-stateless-components-react/

##### Functional stateless components are defined the following way:

```javascript
export default defineComponent({
    displayName: 'Greeting',

    properties: {
        name: {
            type: String,
            defaultValue: 'User'
        }
    },

    render(props) {
        return createElement(
            'div', null, `Hello ${props.name}`);
    }
})
```

##### Complex non-functional components are defined the following way:

```javascript
export default defineComponent({
    displayName: 'DatePicker',

    properties: {
        value: {
            type: Date,
            getDefaultValue: () =>
                new Date(new Date().toDateString())
        },

        localizer: {
            type: Localizer,
            inject: true,
            defaultValue: Localizer.getDefault();
        },

        onChange: {
            type: Function,
            nullable: true,
            defaultValue: null
        }
    },

    methods: ['focus', 'blur'],



    init(updateView, forwardState) {
        // ... to complicated to show here ....
        // But fyi:
        //   updateView:
        //     (vdom, childContext, callbackWhenDone) => {}
        //
        //   forwardState: state => {}
        //      Just to inform the underlying
        //      component system about a state
        //      change
        //      (e.g. for React Developer Tools)
        //
        //   setProps: props => {}
        //   applyMethod: (methodName, args) => any
        //   close: close() => {}

        return {
            setProps,
            applyMethod,
            close
        }
    }
})
```
**TODO**: More info will follow...

Returns a component factory to generate corresponding component speific VDOM elements.

**TODO**: The component factory will be enriched with some meta information about the component type - details will follow...

#### mount(content, target)

Mounts/renders a VDOM tree specified by argument `content` to a real DOM element specified by `target` (either the DOM element itself or the corresponding ).

Will return the following object:
`{ node, unmount() }`, where `node` is the concrete target node, `unmount` is a function that can be used to unmount/dismiss the mounted component.
In case that the DOM element `target` could not be found then `null` will be returned.

**TODO**: Function `mount` will behave differently in "React Native" - details will follow...

### Differences between different adapters

jsSurface will NOT hide all UI libraries specialities. For example different UI libraries may use different event systems on top of the usual DOM event system (for example "SyntheticEvents" in React).
jsSurface will only normalize the different behaviors if this normalization will not generate too much code (jsSurface should stay as small as possible).
Please keep that in mind.

