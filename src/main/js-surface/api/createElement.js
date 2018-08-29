import VirtualElement from '../internal/element/VirtualElement'

import preact from 'preact'

export default function createElement(/* arguments */) {
  const
    argCount = arguments.length,
    type = arguments[0],
    secondArg = arguments[1],

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
      addChildren(children, arguments[firstChildIdx + i])
    }
  }

  let props = null

  if (hasChildren && !skippedProps){
    if (secondArg !== undefined && secondArg !== null) {
      props = secondArg
    }
  } else if (!hasChildren && argCount === 2) {
    props = secondArg || null
  }

  const ret = new VirtualElement(type, props, children)

  if (preact.options.vnode) {
    preact.options.vnode(ret)
  }

  return ret
}

function addChildren(targetArray, children) {
  const type = typeof children 

  if (children === undefined || children === null || children === false) {
    // nothing to do
  } else if (type !== 'object') {
    const
      lastIndex = targetArray.length - 1,
      latest = lastIndex === -1 ? null : targetArray[lastIndex],
      typeLatest = typeof latest

    if (lastIndex >= 0 && typeLatest !== 'object' && typeLatest !== 'symbol') {
      targetArray[lastIndex] = String(latest) + children 
    } else {
      targetArray.push(children)
    }
  } else if (!children[Symbol.iterator]) {
    targetArray.push(children)
  } else if (Array.isArray(children)) {
    for (let i = 0; i < children.length; ++i) {
      addChildren(targetArray, children[i])
    }
  } else {
    for (const child of children) {
      addChildren(targetArray, child)
    }
  }
}
