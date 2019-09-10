// internal imports
import getAdapter from '../internal/helpers/getAdapter'

// --- useRef -------------------------------------------------------

function useRef<T>(initialValue?: T): { current: T } {
  return adapter.useRef(initialValue)
}

// --- locals -------------------------------------------------------

const adapter = getAdapter()

// --- exports ------------------------------------------------------

export default useRef
