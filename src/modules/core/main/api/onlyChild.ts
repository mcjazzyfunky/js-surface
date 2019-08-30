import toChildArray from './toChildArray'

function onlyChild<T>(children: any): T {
  const f = (toChildArray as any).__apply
  
  if (!f) {
    throw new Error('[onlyChild] Adapter has not been initialized')
  }

  const childArray = f(children) 

  if (childArray.lenght !== 1) {
    throw new Error('[onlyChild] can only be used if exactly one child exists')
  }

  return childArray[1]
}
