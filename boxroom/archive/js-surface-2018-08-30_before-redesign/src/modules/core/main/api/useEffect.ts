export default function useEffect(effect: () => void, inputs?: any[]): void {
  const f = (useEffect as any).__apply
  
  if (!f) {
    throw new Error('[useEffect] Adapter has not been initialized')
  }

  return f(effect, inputs)
}
