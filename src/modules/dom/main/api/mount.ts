import { kindOf, VirtualElement } from '../../../core/main/index'

import React from 'react' 
import ReactDOM from 'react-dom'

export default function mount(element: VirtualElement, container: Element) { 
  if (kindOf(element) !== 'element') {
    throw new TypeError(
      '[mount] First argument "element" must be a virtual element')
  }

  if (!container || !container.tagName) {
    throw new TypeError(
      '[mount] Second argument "container" must be a valid DOM element')
  }

  console.log(element)
  console.log(convertNode(element))

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

function convertStatefulComponent(it: any): Function {
  const ret: Function = null // TODO 

  return ret
}
