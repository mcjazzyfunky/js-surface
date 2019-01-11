import { createElement, VirtualElement, Context, Fragment } from '../../../core/main/index'
import React from 'react' 
import ReactDOM from 'react-dom'

Object.defineProperty(Fragment, '__internal_type', {
  value: React.Fragment
})

export default function mount(element: VirtualElement, container: Element | string) { 
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

  ReactDOM.render(convertNode(element), target)
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
    newType = typeof type === 'function' && type.__internal_type ? type.__internal_type : type
  
  let newProps = props ? { ...props } : null

  if (newChildren && newChildren !== children) {
    newProps.children = newChildren
  }

  if (type && type['js-surface:kind'] === 'contextConsumer' && newProps.children && typeof newProps.children[0] === 'function') { 
    const consume = newProps.children[0]
    newProps.children[0] = (value: any) => convertNode(consume(value))
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
         convertComponent(it)
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

function convertComponent(it: any): Function {
  let ret: any = (props: any, ref: any = null) => convertNode(it.meta.render(props, ref))

  ret.displayName = it.meta.displayName

  if (it.meta.render.length > 1) {
    ret = React.forwardRef(ret)
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

export function convertContext(it: any): any {
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
