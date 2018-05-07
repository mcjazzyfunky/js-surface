import createElement from './createElement';

import React from 'react';

export default function Fragment(...args) {
  return createElement(Fragment, ...args);
}

Fragment.__internalType = React.Fragment;