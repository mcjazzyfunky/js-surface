export default function forEachChild(children: any, action: (child: any) => void): void { // TODO
  const f = (forEachChild as any).__apply
  
  if (!f) {
    throw new Error('[forEachChild] Adapter has not been initialized')
  }

  f(children, action)
}
