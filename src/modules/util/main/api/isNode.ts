import { kindOf } from '../../../core/main/index'

export default function isNode(it: any): boolean {
  let ret = it === null || it === undefined || kindOf(it) === 'element'

  if (!ret) {
    const type = typeof it

    ret = type === 'boolean' || type === 'number' || type === 'string'
  }

  return ret
}

Object.defineProperty(isNode, 'js-spec:validate', {
  value(it: any) {
    return isNode(it)
      ? null
      : new Error('Must be a valid node')
  }
})
