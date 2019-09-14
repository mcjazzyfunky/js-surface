// internal imports
import _useRef from '../internal/adaption/dyo/useRef'

// --- useRef -------------------------------------------------------

function useRef<T>(initialValue?: T): { current: T } {
  return _useRef(initialValue)
}

// --- exports ------------------------------------------------------

export default useRef
