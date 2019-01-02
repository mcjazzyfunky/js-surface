import ComponentFactory from './types/StatelessComponentFactory'
import VirtualElement from './types/VirtualElement'
import Props from './types/Props'

function createElement(...args: any[]): VirtualElement
function createElement(/* arguments */): VirtualElement {
  const
    argCount = arguments.length,
    type = arguments[0],
    secondArg = arguments[1],

    skippedProps = argCount > 1 && secondArg !== undefined && secondArg !== null
        && (typeof secondArg !== 'object' || secondArg instanceof VirtualElementClass
          || typeof secondArg[Symbol.iterator] === 'function'),

    hasChildren = argCount > 2 || argCount === 2 && skippedProps

  let
    props: Props = null,
    children: any[] = null

  if (hasChildren) {
    children = []

    for (let i = 2 - (skippedProps ? 1 : 0); i < argCount; ++i) {
      const child: any = children[i]

      if (child && (Array.isArray(child) || typeof child[SYMBOL_ITERATOR] === 'function')) {
        pushItems(children, child)
      } else {
        children.push(child)
      }
    }
  }

  if (argCount > 1 && !skippedProps) {
    if (!hasChildren) {
      props = secondArg
    } else {
      props = {}

      const keys = Object.keys(secondArg)

      for (let i = 0; i < keys.length; ++i) {
        const key = keys[i]
        
        props[key] = secondArg[key] 
      }

      props.children = children
    }
  } else if (hasChildren) {
    props = { children }
  }

  return new VirtualElementClass(type, props)
}

export default createElement

// --- locals -------------------------------------------------------

const
  SYMBOL_ITERATOR =
    typeof Symbol === 'function' && Symbol.iterator
      ? Symbol.iterator
      : '@@iterator'

const VirtualElementClass = class VirtualElement {
  type: string | ComponentFactory
  props: Object | null

  constructor(type: string | ComponentFactory, props: Object | null) {
    this.type = type
    this.props = props
  }
}

function pushItems(array: any[], items: Iterable<any>) {
  if (Array.isArray(items)) {
    for (let i = 0; i < items.length; ++i) {
      const item = items[i]

      if (item && (Array.isArray(item) || typeof item[SYMBOL_ITERATOR] === 'function')) {
        pushItems(array, item)
      } else {
        array.push(item)
      }
    }
  } else {
    for (const item of items) {
      if (item && (Array.isArray(item) || typeof item[SYMBOL_ITERATOR] === 'function')) {
        pushItems(array, item)
      } else {
        array.push(item)
      }
    }
  }
}
