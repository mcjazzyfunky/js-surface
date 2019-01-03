import ReactDOM from 'react-dom'

export default function unmount(container: Element) {
  if (!container || !container.tagName) {
    throw new TypeError(
      '[unmount] First argument "container" must be a valid DOM element')
  }

  ReactDOM.unmountComponentAtNode(container)
}
