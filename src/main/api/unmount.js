// internal imports
import unmountComponentAtNode from '../internal/adaption/dyo/unmountComponentAtNode'

// --- unmount ------------------------------------------------------

function unmount(container) {
  if (!container || (typeof container !== 'string' && !container.tagName)) {
    throw new TypeError(
      '[unmount] First argument "container" must be a DOM element or the id of the corresponding DOM element')
  }

  const target =
    typeof container === 'string'
      ? document.getElementById(container)
      : container

  if (!target) {
    throw new TypeError(
      `[unmount] Could not find container DOM element with id "${container}"`)
  }

  unmountComponentAtNode(target)
}

// --- exports ------------------------------------------------------

export default unmount
