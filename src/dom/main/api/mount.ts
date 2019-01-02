import { isElement, VirtualElement } from 'js-surface'

import React from 'react'
import ReactDOM from 'react-dom'

export default function mount(element: VirtualElement, target: Element) { 
  if (!isElement(element)) {
    throw new TypeError(
      '[mount] First argument must be a virtual element');
  }

  if (!target || !target.tagName) {
    throw new TypeError(
      '[mount] Second argument must be a valid target element');
  }



}