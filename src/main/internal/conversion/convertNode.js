import convertNodes from './convertNodes';
import VirtualElement from '../element/VirtualElement';
import RefProxy from '../proxy/RefProxy';

import React from 'react';

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

  if (type.__internalIsConsumer && newProps.children && typeof newProps.children[0] === 'function') {
    const consume = newProps.children[0];
    newProps.children = value => convertNode(consume(value));
  }

  if (newProps && newProps.ref && typeof type !== 'string') {
    const oldRef = newProps.ref;

    newProps.ref = ref => {
      const meta = ref ? ref.__meta : meta;

      if (!meta) {
        return ref;
      }

      const refProxy = new RefProxy(ref, meta);
      return oldRef(refProxy);
    };
  }

  let ret = null;

  if (!newProps || !newProps.children) {
    ret = React.createElement(newType, newProps);
  } else {
    const
      children = newProps.children,
      childCount = newProps.children.length,
      newArgs = new Array(childCount + 2);

    newArgs[0] = newType;
    newArgs[1] = newProps;

    for (let i = 0; i < childCount; ++i) {
      newArgs[i + 2] = children[i];
    }

    ret = React.createElement.apply(null, newArgs);
  }

  return ret;
}

