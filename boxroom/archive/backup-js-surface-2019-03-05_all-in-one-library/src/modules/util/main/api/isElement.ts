import { createElement } from '../../../core/main/index'

export default function isElement(it: any): boolean {
  return it instanceof VirtualElementClass
}

Object.defineProperty(isElement, 'js-spec:validate', {
  value(it: any) {
    return isElement(it)
      ? null
      : new Error('Must be a valid element')
  }
})

// --- locals -------------------------------------------------------

const VirtualElementClass = createElement('div').constructor