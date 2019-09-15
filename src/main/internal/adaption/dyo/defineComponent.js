// external imports
import { memo } from 'dyo'

// --- defineComponents ---------------------------------------------

function defineComponent(
  displayName,
  renderer,
  forwardRef,
  memoize,
  validate
) {
  let ret = renderer.bind(null)
  ret.displayName = displayName

  if (validate) {
    ret.validate = validate
  }

  if (memoize === true) {
    ret = memo(ret)
  }

  return ret
}

// --- exports ------------------------------------------------------

export default defineComponent
