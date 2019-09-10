// internal imports
import getAdapter from '../internal/helpers/getAdapter'

// --- useCallback --------------------------------------------------

function useCallback<T = void>(callback: (...args: any[]) => T, inputs?: any[]): (...args: any[]) => any {
  return adapter.useCallback(callback, inputs)
}

// --- locals -------------------------------------------------------

const adapter = getAdapter()

// --- exports ------------------------------------------------------

export default useCallback