import preact from 'preact';

export default function unmount(target) {
  const targetNode =
    typeof target === 'string'
      ? document.getElementById(target)
      : target;

  preact.unmountComponentAtNode(targetNode);
}