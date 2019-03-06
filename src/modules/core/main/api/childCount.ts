export default function childCount(children: any): number {
  const f = (childCount as any).__apply
  
  if (!f) {
    throw new Error('[childCount] Adapter has not been initialized')
  }

  return f(children)
}
