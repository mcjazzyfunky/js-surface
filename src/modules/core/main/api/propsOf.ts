import isElement from './isElement'

export default function propsOf(elem: any): any { // TODO
  const f = (propsOf as any).__apply
  
  if (!f) {
    throw new Error('[propsOf] Adapter has not been initialized')
  }

  let ret = null

  if (isElement(it)) {
    ret = f(it)
  }

  return ret
}
