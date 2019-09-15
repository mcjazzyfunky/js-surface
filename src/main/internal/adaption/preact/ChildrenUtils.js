// external imports
import Preact from 'preact'

// --- ChildrenUtils ------------------------------------------------

const ChildrenUtils = {
  forEach: (children, action) => Preact.toChildArray(children).forEach(action),
  toArray: Preact.toChildArray,
  count: children => Preact.toChildArray(children).length
}

// --- exports ------------------------------------------------------

export default ChildrenUtils
