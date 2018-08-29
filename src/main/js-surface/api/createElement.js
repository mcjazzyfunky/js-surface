import VirtualElement from '../internal/element/VirtualElement'

import preact from 'preact'

export default function createElement(type, secondArg /* other arguments */) {
  const
    argCount = arguments.length,

    skippedProps = argCount > 1 && secondArg !== undefined && secondArg !== null
        && (typeof secondArg !== 'object' || secondArg instanceof VirtualElement
          || typeof secondArg[Symbol.iterator] === 'function'),

    hasChildren = argCount > 2 || argCount === 2 && skippedProps

  let children = null

  if (hasChildren) {
    const
      firstChildIdx = 1 + !skippedProps,
      childCount = argCount - firstChildIdx

    children = []

    for (let i = 0; i < childCount; ++i) {
      const child = arguments[firstChildIdx + i]

      addChildren(children, child)
    }
  }

  let props = null

  if (hasChildren && !skippedProps) {
    if (secondArg === undefined || secondArg === null) {
      props = { children }
    } else {
      props = {}
        
      const
        keys = Object.keys(secondArg),
        keyCount = keys.length

      for (let i = 0; i < keyCount; ++i) {
        const key = keys[i]

        props[key] = secondArg[key]
      }

      props.children = children
    }
  } else if (hasChildren && skippedProps) {
    props = { children }
  } else if (!hasChildren && argCount === 2) {
    props = secondArg || null
  }

  const ret = new VirtualElement(type, props)

  if (preact.options.vnode) {
    preact.options.vnode(ret)
  }

  return ret
}

function addChildren(targetArray, children) {
  if (children !== undefined && children !== null && children !== false) {
    if (!children[Symbol.iterator] || typeof children === 'string') {
      targetArray.push(children)
    } else {
      if (Array.isArray(children)) {
        for (let i = 0; i < children.length; ++i) {
          addChildren(targetArray, children[i])
        }
      } else {
        for (const child of children) {
          addChildren(targetArray, child)
        }
      }
    }
  }
}
