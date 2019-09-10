// internal imports
import getAdapter from '../internal/helpers/getAdapter'
import Children from './types/Children'

// --- childCount ---------------------------------------------------

function childCount(children: Children): number {
  return adapter.childCount(children)
}

// --- locals -------------------------------------------------------

const adapter = getAdapter()

// --- exports ------------------------------------------------------

export default childCount
