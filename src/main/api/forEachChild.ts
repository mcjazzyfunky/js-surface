import ChildrenUtils from '../internal/adaption/dyo/ChildrenUtils'

// --- forEachChild -------------------------------------------------

function forEachChild(children: any, action: (child: any) => void): void { // TODO
  ChildrenUtils.forEach(children, action)
}

// --- exports ------------------------------------------------------

export default forEachChild
