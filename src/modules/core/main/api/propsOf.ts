// internal imports
import isElement from './isElement'
import getAdapter from '../internal/helpers/getAdapter'
import Props from './types/Props'
import VirtualElement from './types/VirtualElement'

// --- propsOf ------------------------------------------------------

function propsOf(elem: VirtualElement<any>): Props | null {
  let ret = null

  if (isElement(elem)) {
    ret = adapter.propsOf(elem)
  }

  return ret
}

// --- locals -------------------------------------------------------

const adapter = getAdapter()

// --- exports ------------------------------------------------------

export default propsOf
