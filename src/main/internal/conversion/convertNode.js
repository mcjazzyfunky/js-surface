import convertNodes from './convertNodes';
import VirtualElement from '../element/VirtualElement';

import dio from 'dio.js';

export default function convertNode(node) {
  if (node && typeof node === 'object' && typeof node[Symbol.iterator] === 'function') {
    return convertNodes(node);
  } else if (!(node instanceof VirtualElement)) {
    return node;
  }

  const
    type = node.type,
    props = node.props,
    children = props ? props.children || null : null,
    newChildren = children ? convertNodes(children) : null;

  const
    newType = typeof type === 'function' && type.__internalType ? type.__internalType : type,
    newProps = props ? { ...props } : null;

  if (newChildren && newChildren !== children) {
    newProps.children = newChildren;
  }

  return dio.createElement(newType, newProps);
}

