// internal imports
import getAdapter from '../internal/helpers/getAdapter'

// --- useEffect ----------------------------------------------------

function useEffect(effect: () => void, inputs?: any[]): void {
  adapter.useEffect(effect, inputs)
}

// --- locals -------------------------------------------------------

const adapter = getAdapter()

// --- exports ------------------------------------------------------

export default useEffect
