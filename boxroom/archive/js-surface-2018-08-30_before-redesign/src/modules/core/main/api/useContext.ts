import Context from './types/Context'

export default function useContext<T>(ctx: Context<T>): T {
  const f = (useContext as any).__apply
  
  if (!f) {
    throw new Error('[useContext] Adapter has not been initialized')
  }

  return f(ctx)
}
