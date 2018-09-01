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
    let errorMsg =
      e instanceof Error
        ? e.message
        : String(e)
      
    errorMsg = '[mount] Could not mount element: ' + errorMsg

    if (e instanceof Error) {
      e.message = errorMsg

      throw e
    } else {
      throw new Error(errorMsg)
    }
  }
}

