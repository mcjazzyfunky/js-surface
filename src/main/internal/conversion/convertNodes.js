import convertNode from './convertNode';
import VirtualElement from '../element/VirtualElement';

export default function convertNodes(elements) {
  const ret = [...elements];

  for (let i = 0; i < elements.length; ++i) {
    const child = elements[i];

    if (child instanceof VirtualElement) {
      ret[i] = convertNode(child);
    } else if (child && typeof child === 'object' && typeof child[Symbol.iterator] === 'function') {
      ret[i] = convertNodes(child);
    }
  }

  return ret;
}