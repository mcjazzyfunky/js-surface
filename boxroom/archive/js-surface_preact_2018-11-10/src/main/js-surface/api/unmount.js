import preact from 'preact'

export default function unmount(container) {
  if (!container || !container.tagName) {
    throw new TypeError(
      '[unmount] The first argument "container" must be a DOM element ')
  }

  preact.unmountComponentAtNode(container)
}
