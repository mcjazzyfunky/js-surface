import createElement from './createElement';

import dio from 'dio.js';

export default function Fragment(...args) {
  return createElement(Fragment, ...args);
}

Fragment.__internalType = dio.Fragment;