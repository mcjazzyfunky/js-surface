import VirtualElement from '../internal/element/VirtualElement'
import defineHiddenProperty from '../internal/helper/defineHiddenProperty'

const isElement = it => it instanceof VirtualElement 

defineHiddenProperty(isElement,
  it => it instanceof VirtualElement
    ? null
    : new Error('Must be a virtual element'))

export default isElement
