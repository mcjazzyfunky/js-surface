import VirtualElement from '../internal/element/VirtualElement';

export default function createElement(/* arguments */) {
  const
    argCount = arguments.length,
    type = arguments[0],
    secondArg = arguments[1],

    skippedProps = argCount > 1 && secondArg !== undefined && secondArg !== null
        && (typeof secondArg !== 'object' || secondArg instanceof VirtualElement
          || typeof secondArg[Symbol.iterator] === 'function'),

    hasChildren = argCount > 2 || argCount === 2 && skippedProps;

  let children = null;

  if (hasChildren) {
    const
      firstChildIdx = 1 + !skippedProps,
      childCount = argCount - firstChildIdx;

    children = new Array(childCount);

    for (let i = 0; i < childCount; ++i) {
      children[i] = arguments[firstChildIdx + i];
    }
  }

  let props = null;

  if (hasChildren && !skippedProps) {
    if (secondArg === undefined || secondArg === null) {
      props = { children };
    } else {
      props = {};
        
      const
        keys = Object.keys(secondArg),
        keyCount = keys.length;

      for (let i = 0; i < keyCount; ++i) {
        const key = keys[i];

        props[key] = secondArg[key];
      }

      props.children = children;
    }
  } else if (hasChildren && skippedProps) {
    props = { children };
  } else if (!hasChildren && argCount === 2) {
    props = secondArg || null;
  }

  const ret = Object.create(VirtualElement.prototype);

  ret.type = type;
  ret.props = props;

  return ret;
}
