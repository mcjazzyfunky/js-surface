import isElement from './isElement'

export default function isNode(it: any): boolean {
  let ret = it === null || it === undefined || isElement(it)

  if (!ret) {
    const type = typeof it

    ret = type === 'boolean' || type === 'number' || type === 'string'
      || Array.isArray(it) || typeof it[SYMBOL_ITERATOR] === 'function'
  }

  return ret
}

Object.defineProperty(isNode, 'js-spec:validate', {
  value(it: any) {
    return isNode(it)
      ? null
      : new Error('Must be a virtual node')
  }
})

// --- locals -------------------------------------------------------

const SYMBOL_ITERATOR =
  typeof Symbol === 'function' && Symbol.iterator
    ? Symbol.iterator
    : '@@iterator'
