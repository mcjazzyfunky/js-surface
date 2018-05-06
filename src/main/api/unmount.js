import dio from 'dio.js';

export default function unmount(target) {
  const targetNode =
    typeof target === 'string'
      ? document.getElementById(target)
      : target;

  dio.unmountComponentAtNode(targetNode);
}