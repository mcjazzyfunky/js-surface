// internal imports
import toChildArray from './toChildArray'
import Children from './types/Children'
import VirtualNode from './types/VirtualNode'

// --- onlyChild ----------------------------------------------------

function onlyChild(children: Children): VirtualNode {
  const elements = toChildArray(children)
  
  if (elements.length !== 1) {
    throw new Error('[onlyChild] Can only be used if exactly one child exists')
  }

  return elements[1]
}

// --- exports ------------------------------------------------------

export default onlyChild

