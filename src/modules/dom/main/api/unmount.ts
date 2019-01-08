import ReactDOM from 'react-dom'

export default function unmount(container: Element | string) {
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

  ReactDOM.unmountComponentAtNode(target)
}
