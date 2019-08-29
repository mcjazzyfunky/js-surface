export default function createElement(...args: any[]) {
  const f = (createElement as any).__apply

  if (!f) {
    throw new Error('[createElement] Adapter has not been initialized')
  }

  if (args[0] && args[0].__internal_type !== undefined) {
    args[0] = args[0].__internal_type
  }

  return f.apply(null, args)
}
