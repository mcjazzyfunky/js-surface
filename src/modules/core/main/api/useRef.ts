export default function useRef<T>(initialValue?: T): { current: T } {
  const f = (useRef as any).__apply
  
  if (!f) {
    throw new Error('[useRef] Adapter has not been initialized')
  }

  return f(initialValue) as any
}
