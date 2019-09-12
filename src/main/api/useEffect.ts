// internal imports
import _useEffect from '../internal/adaption/dyo/useEffect'

// --- useEffect ----------------------------------------------------

function useEffect(effect: () => void, inputs?: any[]): void {
  _useEffect(effect, inputs)
}

// --- exports ------------------------------------------------------

export default useEffect
