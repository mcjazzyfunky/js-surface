import VirtualElement from '../internal/element/VirtualElement';

export default function isNode(it) {
  return !it || typeof it !== 'object' || it instanceof VirtualElement
    || typeof it[Symbol.iterator] === 'function';
}