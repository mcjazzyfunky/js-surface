// external import
import { h, Boundary as _Boundary } from 'dyo'

// internal imports
import Children from '../../../api/types/Children'
import VirtualNode from '../../../api/types/VirtualNode'

// --- Boundary -----------------------------------------------------

function Boundary(props: { fallback: (error: any) => VirtualNode, children: Children}):
  VirtualNode
{
  function fallback(error: any) {
    return fallback ? props.fallback(error.message) : null
  }

  return h(_Boundary, { fallback }, props.children)
}

// --- exports ------------------------------------------------------

export default Boundary as any // TODO
