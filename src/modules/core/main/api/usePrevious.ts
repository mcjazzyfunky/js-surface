import useRef from './useRef'
import useEffect from './useEffect'

export default function usePrevious<T>(value: T): T | undefined {
  const
    useRef2 = (useRef as any).__apply,
    useEffect2 = (useEffect as any).__apply
  
  if (!useRef2 || !useEffect2) {
    throw new Error('[usePrevious] Adapter has not been initialized')
  }

  const ref = useRef2(undefined)

  useEffect2(() => {
    ref.current = value
  })

  return ref.current
}
