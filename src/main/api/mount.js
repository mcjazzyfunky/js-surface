import isElement from './isElement'

import preact from 'preact'

export default function mount(element, target) {
  if (!isElement(element)) {
    throw new TypeError(
      '[mount] First argument must be a virtual element')
  }

  const
    targetNode = typeof target === 'string'
      ? document.getElementById(target)
      : target

  if (!targetNode || !targetNode.tagName) {
    throw new TypeError(
      '[mount] Second argument must be a valid target element')
  }

  try {
    preact.render(
      element,
      targetNode)
  } catch (e) {
    const errorMsg =
      e instanceof Error
        ? e.message
        : String(e)

    throw new Error(
      '[mount] Could not mount element - error message: ' + errorMsg)
  }
}

