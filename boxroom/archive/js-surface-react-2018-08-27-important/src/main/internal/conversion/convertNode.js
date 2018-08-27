import convertNodes from './convertNodes';
import VirtualElement from '../element/VirtualElement';

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
    newType = typeof type === 'function' && type.__internal_type ? type.__internal_type : type,
    newProps = props ? { ...props } : null;

  if (newChildren && newChildren !== children) {
    newProps.children = newChildren;
  }

  if (type.__internal_isConsumer && newProps.children && typeof newProps.children[0] === 'function') { 
    const consume = newProps.children[0];
    newProps.children[0] = value => convertNode(consume(value));
  }

  if (newProps && newProps.ref && typeof type !== 'string') {
    const oldRef = newProps.ref;

    newProps.ref = ref => {
      const proxy = ref && ref.__proxy ? ref.__proxy : null;

      return proxy
        ? oldRef(proxy)
        : oldRef(ref);
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

    delete newProps.children;
    newArgs[0] = newType;
    newArgs[1] = newProps;

    for (let i = 0; i < childCount; ++i) {
      newArgs[i + 2] = children[i];
    }

    ret = React.createElement.apply(null, newArgs);
  }

  return ret;
}

