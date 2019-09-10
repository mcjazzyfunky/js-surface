// internal imports
import getAdapter from '../internal/helpers/getAdapter'

// --- isElement ----------------------------------------------------

function isElement(it: any): boolean {
  return adapter.isElement(it)
}

Object.defineProperty(isElement, 'js-spec:validate', {
  value(it: any) {
    return isElement(it)
      ? null
      : new Error('Must be a virtual element')
  }
})

// --- locals -------------------------------------------------------

const adapter = getAdapter()

// --- exports ------------------------------------------------------

export default isElement
