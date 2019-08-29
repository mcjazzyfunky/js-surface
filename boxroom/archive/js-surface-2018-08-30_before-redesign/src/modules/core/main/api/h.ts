import isElement from './isElement'
import createElement from './createElement'
import ComponentFactory from './types/ComponentFactory'
import Props from './types/Props'

function h(type: string | ComponentFactory, props?: Props, ...children: any[]): any // TODO
function h(...args: any[]): any { // TODO
  const
    argCount = args.length,
    secondArg = args[1],

    skippedProps = argCount > 1 && secondArg !== undefined && secondArg !== null
        && (typeof secondArg !== 'object' || isElement(secondArg)
          || typeof secondArg[Symbol.iterator] === 'function' || Array.isArray(secondArg))

  if (skippedProps) {
    for (let i = argCount - 1; i > 0; --i) {
      args[i + 1] = args[i]
    }

    args[1] = null
  }

  return createElement.apply(null, args)
}

export default h
