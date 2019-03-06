import Methods from './types/Methods'

export default function useMethods<M extends Methods>(ref: any, create: () => M, inputs?: any[]) {
  const f = (useMethods as any).__apply
  
  if (!f) {
    throw new Error('[useMethods] Adapter has not been initialized')
  }

  return f(ref, create, inputs)
}
