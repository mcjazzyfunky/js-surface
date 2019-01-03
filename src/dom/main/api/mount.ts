import { isElement, VirtualElement } from 'js-surface'

import React from 'react' 
import ReactDOM from 'react-dom'

export default function mount(element: VirtualElement, container: Element) { 
  if (!isElement(element)) {
    throw new TypeError(
      '[mount] First argument "element" must be a virtual element');
  }

  if (!container || !container.tagName) {
    throw new TypeError(
      '[mount] Second argument "container" must be a valid DOM element');
  }

  ReactDOM.render(React.createElement('div', null, 'Woohoo'), container)
}
