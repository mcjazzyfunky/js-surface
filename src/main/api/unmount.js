import ReactDOM from 'react-dom';

export default function unmount(target) {
  const targetNode =
    typeof target === 'string'
      ? document.getElementById(target)
      : target;

  ReactDOM.unmountComponentAtNode(targetNode);
}