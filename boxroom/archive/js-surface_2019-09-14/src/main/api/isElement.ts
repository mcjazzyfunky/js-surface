// internal imports
import isValidElement from '../internal/adaption/dyo/isValidElement'

// --- isElement ----------------------------------------------------

function isElement(it: any): boolean {
  return isValidElement(it)
}

Object.defineProperty(isElement, 'js-spec:validate', {
  value(it: any) {
    return isElement(it)
      ? null
      : new Error('Must be a virtual element')
  }
})

// --- exports ------------------------------------------------------

export default isElement
