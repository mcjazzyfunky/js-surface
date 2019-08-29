export default function toChildArray(children: any): any[] { // TODO
  const f = (toChildArray as any).__apply
  
  if (!f) {
    throw new Error('[toChildArray] Adapter has not been initialized')
  }

  return f(children)
}
