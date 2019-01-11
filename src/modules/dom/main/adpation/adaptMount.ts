import { createElement, VirtualElement, Context, Fragment } from '../../../core/main/index'
import Adapter from '../types/Adapter' 

export default function adaptMount(adapter: Adapter) {
  return (element: any, container: any) => {
    mount(adapter, element, container)
  }
}

function mount(adapter: Adapter, element: VirtualElement, container: Element | string) { 
  if (!isElement(element)) {
    throw new TypeError(
      '[mount] First argument "element" must be a virtual element')
  }

  if (!container || (typeof container !== 'string' && !container.tagName)) {
    throw new TypeError(
      '[mount] Second argument "container" must be a DOM element or the id of the corresponding DOM element')
  }

  const target =
    typeof container === 'string'
      ? document.getElementById(container)
      : container

  if (!target) {
    throw new TypeError(
      `[mount] Could not find container DOM element with id "${container}"`)
  }

  adapter.mount(convertNode(adapter, element), target)
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
  return it !== null && typeof it === 'object' && (Array.isArray(it) || typeof it[SYMBOL_ITERATOR] === 'function')
}

function convertNode(adapter: Adapter, node: any) {
  if (isIterableObject(node)) {
    return convertNodes(adapter, node)
  } else if (!isElement(node)) {
    return node
  }

  const
    type = node.type,
    props = node.props,
    children = props ? props.children || null : null,
    newChildren = children ? convertNodes(adapter, children) : null

  if (type && type['js-surface:kind'] && !type.__internal_type) {
    adjustEntity(adapter, type)
  }

  const
    newType = typeof type === 'function' && type.__internal_type ? type.__internal_type : type
  
  let newProps = props ? { ...props } : null

  if (newChildren && newChildren !== children) {
    newProps.children = newChildren
  }

  if (type && type['js-surface:kind'] === 'contextConsumer' && newProps.children && typeof newProps.children[0] === 'function') { 
    const consume = newProps.children[0]
    newProps.children[0] = (value: any) => convertNode(adapter, consume(value))
  }

  let ret = null

  // TODO - optimize

  if (newProps) {
    delete newProps.key
    delete newProps.ref
  }

  if (node.key !== null || node.ref !== null) {
    newProps = newProps ? Object.assign({}, newProps) : {}

    if (node.key !== undefined && node.key !== null) {
      newProps.key = node.key
    }

    if (node.ref !== undefined && node.ref !== null) {
      newProps.ref = node.ref
    }
  }

  if (!newProps || !newProps.children) {
    ret = adapter.createElement(newType, newProps)
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

    ret = adapter.createElement.apply(null, newArgs)
  }

  return ret
}

function convertNodes(adapter: Adapter, elements: any[]) {
  const ret = [...elements]

  for (let i = 0; i < elements.length; ++i) {
    const child = elements[i]

    if (isElement(child)) {
      ret[i] = convertNode(adapter, child)
    } else if (isIterableObject(child)) {
      ret[i] = convertNodes(adapter, child)
    }
  }

  return ret
}

function adjustEntity(adapter: Adapter, it: any): void {
  const kind: string = it['js-surface:kind'] 

  switch (kind) {
    case 'componentFactory':
      if (it.meta.render) {
         convertComponent(adapter, it)
      }

      break

    case 'contextConsumer':
      convertContext(adapter, it.context)
      break
    
    case 'contextProvider':
      convertContext(adapter, it.context)
      break
  }
}

function convertComponent(adapter: Adapter, it: any): Function {
  let ret: any = (props: any, ref: any = null) => convertNode(adapter, it.meta.render(props, ref))

  ret.displayName = it.meta.displayName

  if (it.meta.render.length > 1) {
    ret = adapter.forwardRef(ret)
  }

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

export function convertContext(adapter: Adapter, it: any): any {
  const ret = adapter.createContext(it.Provider.meta.properties.value.defaultValue)
  
  ret.Provider._context = ret
  ret.Consumer._context = ret
      
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
