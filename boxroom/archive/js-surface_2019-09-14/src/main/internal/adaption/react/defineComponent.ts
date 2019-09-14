// external imports
import React from 'react'

// internal imports
import Props from '../../../api/types/Props'

// --- defineComponent ----------------------------------------------

function defineComponent<P extends Props = {}>(
  displayName: string,
  renderer: (props: P) => any,
  forwardRef: boolean,
  memoize: boolean,
  validate: (props: P) => boolean | null | Error
): any {
  let ret: any

  if (!forwardRef) {
    ret = renderer.bind(null)
  } else {
    ret = (props: any, ref: any) => {
      if (ref !== undefined) {
        props = { ...props, ref }
      }

      return renderer(props)
    }
  }
  
  ret.displayName = displayName

  if (validate) {
    ret.propTypes = {
      '*'(props: any) {
        const
          result = validate(props),

          errorMsg =
            result === false
              ? 'Invalid value'
              : result instanceof Error
                ? result.message
                : null

        return !errorMsg
          ? null
          : new TypeError(
            'Props validation error for component '
            + `"${displayName}" => ${errorMsg}`)
      }
    }
  }

  if (memoize === true) {
    ret = React.memo(ret)
  }
  
  if (forwardRef) {
    ret = React.forwardRef(ret)
  }

  return ret
}

// --- exports ------------------------------------------------------

export default defineComponent
