import toChildArray from './toChildArray'

export default function withChildren(f: (childArray: any) => any) {
  if (typeof f !== 'function') {
    throw new TypeError('[withChildren] First argument "f" must be a function')
  }

  const g = (toChildArray as any).__apply

  if (!g) {
    throw new Error('[withChildren] Adapter has not been initialized')
  }

  return (children: any) => f(g(children))
}
