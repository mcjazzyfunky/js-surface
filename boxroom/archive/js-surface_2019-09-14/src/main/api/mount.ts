// internal imports
import isElement from './isElement'
import render from '../internal/adaption/dyo/render'

// --- mount --------------------------------------------------------

function mount(element: any, container: Element | string) {
  if (!isElement(element)) {
    throw new TypeError(
      '[mount] First argument "element" must be a virtual element')
  }

  if (!container || (typeof container !== 'string' && !container.tagName)) {
    throw new TypeError(
      '[mount] Second argument "container" must be a DOM element or the id of the corresponding DOM element')
  }

  const target =
    typeof container === 'string'
      ? document.getElementById(container)
      : container

  if (!target) {
    throw new TypeError(
      `[mount] Could not find container DOM element with id "${container}"`)
  }

  render(element, target)
}

// --- exports ------------------------------------------------------

export default mount
