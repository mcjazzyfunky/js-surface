// internal imports
import forEachChild from './forEachChild'

// --- mapChildren --------------------------------------------------

function mapChildren(children, mapper) {
  const ret = []

  forEachChild(children, child => ret.push(mapper(child)))

  return ret
}

// --- exports ------------------------------------------------------

export default mapChildren
