// external imports
import PreactCompat from 'preact/compat'

// --- defineComponent ----------------------------------------------

function defineComponent(
  displayName,
  renderer,
  forwardRef,
  memoize,
  validate
) {
  let ret

  if (!forwardRef) {
    ret = renderer.bind(null)
  } else {
    ret = (props, ref) => {
      if (ref !== undefined) {
        props = Object.assign({}, props)
        props.ref = ref
      }

      return renderer(props)
    }
  }
  
  ret.displayName = displayName

  if (validate) {
    ret.propTypes = {
      '*'(props) {
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

  if (forwardRef) {
    ret = PreactCompat.forwardRef(ret)
  }

  if (memoize === true) {
    ret = PreactCompat.memo(ret)
  }

  return ret
}

// --- exports ------------------------------------------------------

export default defineComponent
