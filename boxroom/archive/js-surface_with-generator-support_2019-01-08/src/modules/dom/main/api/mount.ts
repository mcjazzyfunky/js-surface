/*

This file is a complete mess :( - sorry for that - will be fixed some day
This file is a complete mess :( - sorry for that - will be fixed some day
This file is a complete mess :( - sorry for that - will be fixed some day
This file is a complete mess :( - sorry for that - will be fixed some day
This file is a complete mess :( - sorry for that - will be fixed some day
This file is a complete mess :( - sorry for that - will be fixed some day
This file is a complete mess :( - sorry for that - will be fixed some day
This file is a complete mess :( - sorry for that - will be fixed some day
This file is a complete mess :( - sorry for that - will be fixed some day
This file is a complete mess :( - sorry for that - will be fixed some day
This file is a complete mess :( - sorry for that - will be fixed some day
This file is a complete mess :( - sorry for that - will be fixed some day
This file is a complete mess :( - sorry for that - will be fixed some day

*/

import { createElement, VirtualElement, Context } from '../../../core/main/index'
import React from 'react' 
import ReactDOM from 'react-dom'
import { any } from 'prop-types';

const { useState, useEffect, useRef, useContext } = React as any

export default function mount(element: VirtualElement, container: Element) { 
  if (!isElement(element)) {
    throw new TypeError(
      '[mount] First argument "element" must be a virtual element')
  }

  if (!container || !container.tagName) {
    throw new TypeError(
      '[mount] Second argument "container" must be a valid DOM element')
  }

  ReactDOM.render(convertNode(element), container)
}

// --- locals -------------------------------------------------------

const
  VirtualElementClass = createElement('div').constructor,

  SYMBOL_ITERATOR =
    typeof Symbol === 'function' && Symbol.iterator
      ? Symbol.iterator
      : '@@iterator'

function isElement(it: any) {
  return it instanceof VirtualElementClass
}

function isIterableObject(it: any): boolean {
  return typeof it === 'object' && (Array.isArray(it) || typeof it[SYMBOL_ITERATOR] === 'function')
}

function convertNode(node: any) {
  if (isIterableObject(node)) {
    return convertNodes(node)
  } else if (!isElement(node)) {
    return node
  }

  const
    type = node.type,
    props = node.props,
    children = props ? props.children || null : null,
    newChildren = children ? convertNodes(children) : null

  if (type && type['js-surface:kind'] && !type.__internal_type) {
    adjustEntity(type)
  }

  const
    newType = typeof type === 'function' && type.__internal_type ? type.__internal_type : type,
    newProps = props ? { ...props } : null

  if (newChildren && newChildren !== children) {
    newProps.children = newChildren
  }

  if (type && type['js-surface:kind'] === 'contextConsumer' && newProps.children && typeof newProps.children[0] === 'function') { 
    const consume = newProps.children[0]
    newProps.children[0] = (value: any) => convertNode(consume(value))
  }

  if (newProps && newProps.ref && typeof type !== 'string') {
    const oldRef = newProps.ref

    newProps.ref = (ref: any) => {
      const proxy = ref && ref.__proxy ? ref.__proxy : null

      return proxy
        ? oldRef(proxy)
        : oldRef(ref)
    }
  }

  let ret = null

  if (!newProps || !newProps.children) {
    ret = React.createElement(newType, newProps)
  } else {
    const
      children = newProps.children,
      childCount = newProps.children.length,
      newArgs = new Array(childCount + 2)

    delete newProps.children
    newArgs[0] = newType
    newArgs[1] = newProps

    for (let i = 0; i < childCount; ++i) {
      newArgs[i + 2] = children[i]
    }

    ret = React.createElement.apply(null, newArgs)
  }

  return ret
}

function convertNodes(elements: any[]) {
  const ret = [...elements]

  for (let i = 0; i < elements.length; ++i) {
    const child = elements[i]

    if (isElement(child)) {
      ret[i] = convertNode(child)
    } else if (isIterableObject(child)) {
      ret[i] = convertNodes(child)
    }
  }

  return ret
}

function adjustEntity(it: any): void {
  const kind: string = it['js-surface:kind'] 

  switch (kind) {
    case 'componentFactory':
      if (it.meta.render) {
         convertStatelessComponent(it)
      } else if (it.meta.init.length > 0) {
         convertStatefulComponent(it)
      } else {
        convertStatefulComponentWithGenerators(it)
      }

      break

    case 'contextConsumer':
      convertContext(it.context)
      break
    
    case 'contextProvider':
      convertContext(it.context)
      break
  }
}

function convertStatelessComponent(it: any): Function {
  const ret: any = (props: any) => convertNode(it.meta.render(props))

  ret.displayName = it.meta.displayName

  Object.defineProperty(it, '__internal_type', {
    value: ret
  })

  return ret
}

type LifecycleHandlers = {
  didMount: () => void,
  didUpdate: () => void,
  willUnmount: () => void
}

function convertStatefulComponent(it: any): Function {
  const ret: any = (props: any) => {
    const
      currentProps = useRef(props),
      currentValues = useRef(),
      contextValues = useRef([]),
      [state, setState] = useState([]),
      [internals, setInternals] = useState(() => {
        const
          lifecycleHandlers = {} as LifecycleHandlers,
          
          consumeContext = (ctx: Context<any>) => {
            if (!(ctx.Provider as any).__internal_type) {
              convertContext(ctx)
            }

            const index = contextValues.current.length

            contextValues.current[index] = [ctx, undefined]

            return () => contextValues.current[index][1]
          },
          
          self = new Component(
            () => currentProps.current,
            (initialValue: any) => {
              const index = state.length

              state[index] = initialValue 

              function get() {
                return state[index]
              }

              function set(value: any) {
                setState((state: any[]) => {
                  state[index] = value
                  return state
                })
              }

              return [get, set]
            },
            () => setInternals(internals),
            consumeContext,
            (handlers: LifecycleHandlers) => {
              Object.assign(lifecycleHandlers, handlers)
            }),
          
          render = it.meta.init(self)
          
       
        return { self, render, lifecycleHandlers, isInitialized: false }
      })

    currentProps.current = props

    useEffect(() => {
      if (!internals.isInitialized) {
        internals.lifecycleHandlers.didMount()
        internals.isInitialized = true
      } else {
        internals.lifecycleHandlers.didUpdate()
      }
    })

    useEffect(() => {
      return () => internals.lifecycleHandlers.willUnmount()
    }, [])
  
    for (let i = 0; i < contextValues.current.length; ++i) {
      contextValues.current[i][1] = useContext(contextValues.current[i][0].Provider.__internal_type._context)
    }
    
    return convertNode(internals.render(props))
  } 

  ret.displayName = it.meta.displayName
  
  Object.defineProperty(it, '__internal_type', {
    value: ret
  })

  return ret
}

function convertContext(it: any): any {
  const ret =
    it.Provider.__internal_type && it.Provider.__internal_type._context
      || it.Consumer.__internal_type && it.Consumer.__internal_type._context
      || React.createContext(it.Provider.meta.properties.value.defaultValue)
  
  // TODO

  if (!it.Provider.__internal_type) {
    Object.defineProperty(it.Provider, '__internal_type', {
      value: ret.Provider
    })
  }

  if (!it.Consumer.__internal_type) {
    Object.defineProperty(it.Consumer, '__internal_type', {
      value: ret.Consumer
    })
  }

  return ret
}

class Component {
  constructor(
    getProps: () => any,
    handleState: (initialValue: any) => [() => any, (newValue: any) => void],
    forceUpdate: () => void,
    
    consumeContext: (ctx: Context<any>) => () => any,

    setLifecycleHandlers: (handlers: {
      didMount: () => void,
      didUpdate: () => void,
      willUnmount: () => void
    }) => void
  ) {
      const listeners = {
        didMount: [] as (() => void)[],
        didUpdate: [] as (() => void)[],
        willUnmount: [] as (() => void)[],
      }

      Object.defineProperty(this, 'props', {
        enumerable: true,
        get: getProps
      })

      this.handleState = handleState,
      this.forceUpdate = () => forceUpdate()
      this.consumeContext = consumeContext

      for (const key of Object.keys(listeners)) {
        (this as any)['on' + key[0].toUpperCase() + key.substr(1)] = (listener: () => void) => {
          (listeners as any)[key].push(listener)

          return () => {
            (listeners as any)[key] = (listeners as any)[key].filter((it: any) => it !== listener)
          }
        }
      }

      setLifecycleHandlers({
        didMount() {
          listeners.didMount.forEach(listener => listener())
        },

        didUpdate() {
          listeners.didUpdate.forEach(listener => listener())
        },

        willUnmount() {
          listeners.didUpdate.forEach(listener => listener())
        }
      })

  }

  // will be set by constructor
  //get props(): any {
  //  return ....
  //}

  handleState(initialValue: any) { 
    // will be overridden by constructor
  }

  consumeContext(ctx: Context<any>) {
    // will be overridden by constructor
  }

  forceUpdate() {
    // will be overridden by constructor
  }

  onDidMount() {
    // will be overridden by constructor
  }

  onDidUpdate() {
  }

  onWillUnmount() {
    // will be overridden by constructor
  }
}

function convertStatefulComponentWithGenerators(it: any) {
  const init = it.meta.init

  const reactComponent = (props: any) => {
    let ret = null

    const [internals, setInternals] = useState(() => {
      const
        internals = {
          props,
          state: [] as any,
          contexts: [] as any,
          render: null as any,
          setInternals: null as any, // will be set later,
          isInitialized: false,

          lifecycle: {
            didMount: [] as any,
            didUpdate: [] as any,
            willUnmount: [] as any
          }
        }

      internals.render = processIterator(init(), internals)

      return internals
    })

    useEffect(() => {
      if (!internals.isInitialized) {
        internals.isInitialized = true

        internals.lifecycle.didMount.forEach((it: any) => it())
      } else {
        internals.lifecycle.didUpdate.forEach((it: any) => it())
      }
    })

    useEffect(() => {
      return () => internals.lifecycle.willUnmount.forEach((it: any) => it())
    }, [])
  
    for (let i = 0; i < internals.contexts.length; ++i) {
      internals.contexts[i][1] = useContext(internals.contexts[i][0].Provider.__internal_type._context)
    }

    internals.props = props
    internals.setInternals = setInternals

    return convertNode(internals.render())
  }

  (reactComponent as any).displayName = it.meta.displayName

  it['__internal_type'] = reactComponent 
}

function processIterator(iterator: any, internals: any) {
  let ret = undefined
  let nextInput: any = undefined

  while (true) {
    const { done, value } = iterator.next(nextInput)

    if (done) {
      ret = value 
      break
    }

    if (value && typeof value.next === 'function') {
      nextInput = processIterator(value, internals)
    } else {
      switch (value.type) {
        case 'handleProps':
          nextInput = () => internals.props
          break

        case 'handleContext': {
          if (!value.context.__internal_type) {
            convertContext(value.context)
          }

          const index = internals.contexts.length
          internals.contexts[index] = [value.context, useContext(value.context)]
          nextInput = () => internals.contexts[index][1]
          break
        }

        case 'handleState': {
          let index = internals.state.length

          internals.state[index] = value.initialValue

          nextInput = [
            () => internals.state[index],
            (nextValue: any) => {
              if (!internals.setInternals) {
                internals.state[index] = nextValue
              } else {
                internals.setInternals((internals: any) => {
                  internals.state[index] = nextValue
                  return internals
                })
              }
            }
          ]

          break
        }

        case 'handleForceUpdate':
          nextInput = () => { 
            if (internals.setInternals) {
              internals.setInternals(internals)
            }
          }

          break

        case 'handleLifecycle': {
          const
            event = value.event,
            callback = () => value.callback()

          switch (event) {
            case 'didMount':
            case 'didUpdate':
            case 'willUnmount':
              internals.lifecycle[event].push(callback)

              nextInput = () => {
                internals.lifecycle[event] = internals.lifecycle[event].filter((it: Function) => it !== callback)
              }

              break
          }

          break
        }
      }
    }
  } 

  return ret
}
