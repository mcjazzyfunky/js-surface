import Context from './types/Context'

export default function useContext<T>(ctx: Context<T>): T {
  const f = (useContext as any).__apply

  if (!f) {
    throw new Error('[useContext] Adapter has not been initialized')
  }
console.log(111, f)
  const ret = f(ctx)
  console.log(222)
  return ret
}
