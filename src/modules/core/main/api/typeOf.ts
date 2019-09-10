// internal imports
import isElement from './isElement'
import getAdapter from '../internal/helpers/getAdapter'
import Component from './types/Component'
import VirtualElement from './types/VirtualElement'

// --- typeOf -------------------------------------------------------

function typeOf(elem: VirtualElement<any>): Component<any> | string | null {
  let ret = null

  if (isElement(elem)) {
    ret = adapter.typeOf(elem)
  }

  return ret
}

// --- locals -------------------------------------------------------

const adapter = getAdapter()

// --- exports ------------------------------------------------------

export default typesOf
