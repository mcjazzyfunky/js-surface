// internal imports
import getAdapter from '../internal/helpers/getAdapter'
import Context from './types/Context'

// --- useCallback --------------------------------------------------

function useContext<T>(ctx: Context<T>): T {
  return adapter.useContext(ctx)
}

// --- locals -------------------------------------------------------

const adapter = getAdapter()

// --- exports ------------------------------------------------------

export default useContext
