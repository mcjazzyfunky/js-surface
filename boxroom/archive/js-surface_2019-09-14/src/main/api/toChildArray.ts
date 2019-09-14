// internal import
import Children from './types/Children'
import VirtualNode from './types/VirtualNode'
import ChildrenUtils from '../internal/adaption/dyo/ChildrenUtils'

// --- toChldArray --------------------------------------------------

function toChildArray(children: Children): VirtualNode[] {
  return ChildrenUtils.toArray(children)
}

// --- exports ------------------------------------------------------

export default toChildArray
