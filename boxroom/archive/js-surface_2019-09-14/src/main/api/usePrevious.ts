// internal imports
import useRef from './useRef'
import useEffect from './useEffect'

// --- usePrevious --------------------------------------------------

function usePrevious<T>(value: T): T | undefined {
  const ref = useRef(undefined)

  useEffect(() => {
    ref.current = value
  })

  return ref.current
}

// --- exports ------------------------------------------------------

export default usePrevious
