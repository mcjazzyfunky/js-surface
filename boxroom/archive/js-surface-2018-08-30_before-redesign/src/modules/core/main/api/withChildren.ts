import toChildArray from './toChildArray'

export default function withChildren(f: (childArray: any) => any) {
  if (typeof f !== 'function') {
    throw new TypeError('[withChildren] First argument "f" must be a function')
  }

  return (children: any) => f(toChildArray(children))
}
