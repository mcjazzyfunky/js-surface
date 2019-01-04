import { kindOf, VirtualElement } from '../../../core/main/index'
import React from 'react' 
import ReactDOM from 'react-dom'

const { useState, useEffect, useRef } = React as any

export default function mount(element: VirtualElement, container: Element) { 
  if (kindOf(element) !== 'element') {
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
  SYMBOL_ITERATOR =
    typeof Symbol === 'function' && Symbol.iterator
      ? Symbol.iterator
      : '@@iterator'

function isIterableObject(it: any): boolean {
  return typeof it === 'object' && (Array.isArray(it) || typeof it[SYMBOL_ITERATOR] === 'function')
}

function convertNode(node: any) {
  if (isIterableObject(node)) {
    return convertNodes(node)
  } else if (kindOf(node) !== 'element') {
    return node
  }

  const
    type = node.type,
    kind = kindOf(type),
    props = node.props,
    children = props ? props.children || null : null,
    newChildren = children ? convertNodes(children) : null

  if (kind !== null && kind !== 'element' && !type.__internal_type) {
    adjustEntity(type)
  }

  const
    newType = typeof type === 'function' && type.__internal_type ? type.__internal_type : type,
    newProps = props ? { ...props } : null

  if (newChildren && newChildren !== children) {
    newProps.children = newChildren
  }

  if (kindOf(type) === 'contextConsumer' && newProps.children && typeof newProps.children[0] === 'function') { 
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

    if (kindOf(child) === 'element') {
      ret[i] = convertNode(child)
    } else if (isIterableObject(child)) {
      ret[i] = convertNodes(child)
    }
  }

  return ret
}

function adjustEntity(it: any): void {
  const kind = kindOf(it)

  let internalType: any = null

  switch (kind) {
    case 'componentFactory':
      internalType = it.meta.render
        ? convertStatelessComponent(it)
        : convertStatefulComponent(it)

      break
  }

  if (internalType) {
    Object.defineProperty(it, '__internal_type', {
      value: internalType
    })
  }
}

function convertStatelessComponent(it: any): Function {
  const ret: any = (props: any) => convertNode(it.meta.render(props))

  ret.displayName = it.meta.displayName

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
      [values, setValues] = useState({}),
      [internals, setInternals] = useState(() => {
        const
          lifecycleHandlers = {} as LifecycleHandlers,
          
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
    
    return convertNode(internals.render())
  } 

  ret.displayName = it.meta.displayName

  return ret
}

class Component {
  constructor(
    getProps: () => any,
    setValue: (key: string | Symbol, value: any) => void,
    getValue: (key: string | Symbol) => any,
    update: () => void,
    
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

      this.setValue = setValue
      this.getValue = getValue
      this.update = () => update()

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

  setValue(key: string | Symbol, value: any) {
    // will be overridden by constructor
  }

  getValue(key: String | Symbol) {
    // will be overridden by constructor
  }
  
  update() {
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
