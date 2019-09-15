import ChildrenUtils from '../internal/adaption/dyo/ChildrenUtils'

// --- forEachChild -------------------------------------------------

function forEachChild(children, action) {
  ChildrenUtils.forEach(children, action)
}

// --- exports ------------------------------------------------------

export default forEachChild
