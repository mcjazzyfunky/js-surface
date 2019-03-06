import isElement from './isElement'

export default function mount(element: any, container: Element | string) {
  const f = (mount as any).__apply
  
  if (!f) {
    throw new Error('[mount] Adapter has not been initialized')
  }

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

  f(element, target)
}
