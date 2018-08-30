import isElementOfType from './isElementOfType'
import setJsSpecValidator from '../internal/setJsSpecValidator'

export default function isElementsOfType(type, it)  {
  let ret = false

  if (arguments.length > 1) {
    const types = type !== null && typeof type === 'object'
      && typeof type[Symbol.iterator] === 'function'
      ? (Array.isArray(type) ? type : Array.from(type))
      : null

    if (it !== null && typeof it === 'object' && typeof it[Symbol.iterator] === 'function') {
      const items = Array.isArray(it) ? it : Array.from(it)

      for (let i = 0; i < items.length; ++i) {
        if (!isElementsOfType(types || type, items[i])) {
          ret = false
          break
        } else {
          ret = true
        }
      }
    } else {
      ret = isElementOfType(type, it) 
    }
  } else {
    ret = it => isElementsOfType(type, it) 
    
    setJsSpecValidator(ret, it =>
      isElementOfType(type, it)
        ? null
        : new Error('Invalid element type(s)'))
  }

  return ret
}
