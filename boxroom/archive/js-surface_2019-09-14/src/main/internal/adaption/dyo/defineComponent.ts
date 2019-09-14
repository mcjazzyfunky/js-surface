// external imports
import { h, memo } from 'dyo'

// internal import
import Props from '../../../api/types/Props'

// --- defineComponents ---------------------------------------------

function defineComponent<P extends Props = {}>(
  displayName: string,
  renderer: (props: P) => any,
  forwardRef: boolean,
  memoize: boolean,
  validate: (props: P) => boolean | null | Error
): any {
  let ret: any = renderer.bind(null)
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
