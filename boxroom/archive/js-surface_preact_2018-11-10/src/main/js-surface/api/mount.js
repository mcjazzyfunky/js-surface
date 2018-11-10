import isElement from './isElement'
import preact from 'preact'

export default function mount(element, container) {
  if (!isElement(element)) {
    throw new TypeError(
      '[mount] First argument "element" must be a virtual element')
  }

  if (!container || !container.tagName) {
    throw new TypeError(
      '[mount] Second argument "container" must be a DOM element')
  }
 
  try {
    preact.render(element, container)
  } catch (e) {
    let errorMsg =
      e instanceof Error
        ? e.message
        : String(e)
      
    errorMsg = '[mount] Could not mount element: ' + errorMsg

    if (e instanceof Error) {
      try {
        // normally this should not be a problem - but who knows?
        e.message = errorMsg
      } catch (ignore) {
        // ignore possible error message
      }

      throw e
    } else {
      throw new Error(errorMsg)
    }
  }
}
