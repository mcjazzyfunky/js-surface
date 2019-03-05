import Adapter from '../types/Adapter'

export default function adaptUnmount(adapter: Adapter) {
  return (container: any) => unmount(adapter, container)
}

function unmount(adapter: Adapter, container: Element | string) {
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

  adapter.unmount(target)
}
