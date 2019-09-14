// internal imports
import forEachChild from './forEachChild'
import Children from './types/VirtualNode'
import VirtualNode from './types/VirtualNode'

// --- mapChildren --------------------------------------------------

function mapChildren<T>(children: Children, mapper: (child: VirtualNode) => T) {
  const ret: T[] = []

  forEachChild(children, child => ret.push(mapper(child)))

  return ret
}

// --- exports ------------------------------------------------------

export default mapChildren
