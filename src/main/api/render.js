// internal imports
import isElement from './isElement'
import mount from '../internal/adaption/dyo/render'
import unmount from '../internal/adaption/dyo/unmountComponentAtNode'

// --- render --------------------------------------------------------

function render(element, container) {
  if (element !== null && !isElement(element)) {
    throw new TypeError(
      '[render] First argument "element" must be a virtual element or null')
  }

  if (!container || (typeof container !== 'string' && !container.tagName)) {
    throw new TypeError(
      '[render] Second argument "container" must be a DOM element or the id of the corresponding DOM element')
  }

  const target =
    typeof container === 'string'
      ? document.getElementById(container)
      : container

  if (!target) {
    throw new TypeError(
      `[render] Could not find container DOM element with id "${container}"`)
  }

  if (element) {
    mount(element, target)
  } else {
    unmount(target)
  }
}

// --- exports ------------------------------------------------------

export default render
