import childCount from './childCount'
import forEachChild from './forEachChild'

function onlyChild<T>(children: any): T {
  let ret: T

  const count = childCount(children)

  if (count !== 1) {
    throw new Error('[onlyChild] can only be used if exactly one child exists')
  }

  forEachChild(children, child => {
    ret = child
  })

  return ret
}