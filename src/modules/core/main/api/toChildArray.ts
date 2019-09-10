// internal import
import getAdapter from '../internal/helpers/getAdapter'
import Children from './types/Children'
import VirtualNode from './types/VirtualNode'

// --- toChldArray --------------------------------------------------

function toChildArray(children: Children): VirtualNode[] {
  return adapter.toChildArray(children)
}

// --- locals -------------------------------------------------------

const adapter = getAdapter()

// --- exports ------------------------------------------------------

export default toChildArray
