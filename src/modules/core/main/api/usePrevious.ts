import useRef from './useRef'
import useEffect from './useEffect'

export default function usePrevious<T>(value: T): T | undefined {
   const ref = useRef<T>()

  useEffect(() => {
    ref.current = value
  })

  return ref.current
}
