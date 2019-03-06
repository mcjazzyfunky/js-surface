import forEachChild from './forEachChild'

export default function mapChildren<T>(children: any, mapper: (child: any) => T) {
  const ret: T[] = []

  forEachChild(children, child => {
    ret.push(mapper(child))
  })

  return ret
}