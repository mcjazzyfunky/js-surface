import { kindOf } from '../../../core/main/index'

export default function isElement(it: any): boolean {
  return kindOf(it) === 'element'
}

Object.defineProperty(isElement, 'js-spec:validate', {
  value(it: any) {
    return isElement(it)
      ? null
      : new Error('Must be a valid element')
  }
})
