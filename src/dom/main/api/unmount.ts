import ReactDOM from 'react-dom';

export default function unmount(target: Element) {
  if (!target || !target.tagName) {
    throw new TypeError(
      '[unmount] First argument must be a valid target element')
  }

  ReactDOM.unmountComponentAtNode(target)
}