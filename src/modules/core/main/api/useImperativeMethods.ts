import Methods from './types/Methods'

export default function useImperativeMethods<M extends Methods>(ref: any, create: () => M, inputs?: any[]) {
  const f = (useImperativeMethods as any).__apply
  
  if (!f) {
    throw new Error('[useImperativeMethods] Adapter has not been initialized')
  }

  return f(ref, create, inputs)
}
