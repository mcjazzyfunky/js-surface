// internal imports
import { useCallback as _useCallback } from '../internal/adaption/dyo/useCallback'

// --- useCallback --------------------------------------------------

function useCallback<T = void>(callback: (...args: any[]) => T, inputs?: any[]): (...args: any[]) => any {
  return _useCallback(callback, inputs)
}

// --- exports ------------------------------------------------------

export default useCallback