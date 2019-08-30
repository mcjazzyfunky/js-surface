import toChildArray from './forEachChild'

export default function mapChildren<T>(children: any, mapper: (child: any) => T) {
  const f = (toChildArray as any).__apply
  
  if (!f) {
    throw new Error('[mapChildren] Adapter has not been initialized')
  }

  return f(children).map(mapper)
}