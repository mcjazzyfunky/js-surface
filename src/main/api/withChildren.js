// internal imports
import toChildArray from './toChildArray'

// --- withChildren -------------------------------------------------

function withChildren(f) {
  if (typeof f !== 'function') {
    throw new TypeError('[withChildren] First argument "f" must be a function')
  }

  return children => f(toChildArray(children))
}

// --- exports ------------------------------------------------------

export default withChildren
