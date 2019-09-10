// internal imports
import useCallback from './useCallback'
import useState from './useState'

// --- useForceUpdate -----------------------------------------------

function useForceUpdate() {
  const [state, setState] = useState(() => false)

  return useCallback(() => setState(it => !it), [])
}

// --- exports ------------------------------------------------------

export default useForceUpdate
