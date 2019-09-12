// internal imports
import _useContext from '../internal/adaption/dyo/useContext'
import Context from './types/Context'

// --- useCallback --------------------------------------------------

function useContext<T>(ctx: Context<T>): T {
  return _useContext(ctx)
}

// --- exports ------------------------------------------------------

export default useContext
