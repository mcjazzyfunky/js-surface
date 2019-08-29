export default function useState<T>(init: (() => T) | T): [T, (updater: (T | ((value: T) => T))) => void] {
  const f = (useState as any).__apply
  
  if (!f) {
    throw new Error('[useState] Adapter has not been initialized')
  }

  return f(init)
}
