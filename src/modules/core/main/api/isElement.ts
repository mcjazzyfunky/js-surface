export default function isElement(it: any): boolean {
  const f = (isElement as any).__apply
  
  if (!f) {
    throw new Error('[isElement] Adapter has not been initialized')
  }

  return f(it)
}

Object.defineProperty(isElement, 'js-spec:validate', {
  value(it: any) {
    return isElement(it)
      ? null
      : new Error('Must be a virtual element')
  }
})
