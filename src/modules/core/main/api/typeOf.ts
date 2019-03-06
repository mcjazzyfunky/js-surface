import isElement from './isElement'

export default function typeOf(elem: any): any { // TODO
  const f = (typeOf as any).__apply
  
  if (!f) {
    throw new Error('[typeOf] Adapter has not been initialized')
  }

  let ret = null

  if (isElement(it)) {
    ret = f(it)
  }

  return ret
}
