// internal imports
import isValidElement from '../internal/adaption/dyo/isValidElement'

// --- isElement ----------------------------------------------------

function isElement(it) {
  return isValidElement(it)
}

Object.defineProperty(isElement, 'js-spec:validate', {
  value(it) {
    return isElement(it)
      ? null
      : new Error('Must be a virtual element')
  }
})

// --- exports ------------------------------------------------------

export default isElement
