import Platform from '../internal/platform/Platform'

export default function unmount(target) {
  const targetNode =
    typeof target === 'string'
      ? document.getElementById(target)
      : target

  Platform.unmountComponentAtNode(targetNode)
}