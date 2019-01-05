import { createElement, VirtualElement, Context } from '../../../core/main/index'
import React from 'react' 
import ReactDOM from 'react-dom'

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
      } else {
         convertStatefulComponent(it)
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
      currentProps = useRef(),
      currentValues = useRef(),
      contextValues = useRef([]),
      [values, setValues] = useState({}),
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
            (key: string | Symbol, value: any) => {
              if (!internals || !internals.isInitialized) {
                values[key as any] = value
              } else {
                setValues((values: any) => ({ ...values, [key as any]: value }))
              }
            },
            (key: string | Symbol) => currentValues.current[key as any],
            () => setInternals(internals),
            consumeContext,
            (handlers: LifecycleHandlers) => {
              Object.assign(lifecycleHandlers, handlers)
            }),
          
          render = it.meta.init(self)
          
       
        return { self, render, lifecycleHandlers, isInitialized: false }
      })

    currentProps.current = props
    currentValues.current = values

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
    
    return convertNode(internals.render())
  } 

  ret.displayName = it.meta.displayName
  
  Object.defineProperty(it, '__internal_type', {
    value: ret
  })

  return ret
}

function convertContext(it: any): any {
  const ret = React.createContext(it.Provider.meta.properties.value.defaultValue)
  
  // TODO

  Object.defineProperty(it.Provider, '__internal_type', {
    value: ret.Provider
  })

  Object.defineProperty(it.Consumer, '__internal_type', {
    value: ret.Consumer
  })

  return ret
}

class Component {
  constructor(
    getProps: () => any,
    setValue: (key: string | Symbol, value: any) => void,
    getValue: (key: string | Symbol) => any,
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

      this.getProps = getProps
      this.setValue = setValue
      this.getValue = getValue
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

  getProps(): any {
    // will be overridden by constructor
  }

  setValue(key: string | Symbol, value: any) {
    // will be overridden by constructor
  }

  getValue(key: String | Symbol) {
    // will be overridden by constructor
  }

  consumeContext<T>(ctx: Context<T>) {
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
