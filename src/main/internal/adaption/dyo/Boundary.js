// external import
import { h, Boundary as _Boundary } from 'dyo'

// --- Boundary -----------------------------------------------------

function Boundary(props) {
  function fallback(error) {
    return fallback ? props.fallback(error.message) : null
  }

  return h(_Boundary, { fallback }, props.children)
}

// --- exports ------------------------------------------------------

export default Boundary
