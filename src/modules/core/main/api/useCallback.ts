export default function useCallback<T = void>(callback: (...args: any[]) => T, inputs?: any[]): (...args: any[]) => any {
  const f = (useCallback as any).__apply
  
  if (!f) {
    throw new Error('[useCallback] Adapter has not been initialized')
  }

  return f(callback, inputs)
}
