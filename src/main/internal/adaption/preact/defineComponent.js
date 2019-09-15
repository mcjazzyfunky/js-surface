// external imports
import Preact from 'preact'
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
    
    /*
    const oldRet = ret

    ret = function (props) {
      const
        ref = this.__v.ref,

        newProps =
          ret === undefined
            ? props
            : Object.assign({}, props, { ref })

      return oldRet(newProps)
    }
    */
  }

  if (memoize === true) {
    const oldRet = ret

    ret = props => Preact.h(Memo, props, Preact.h(oldRet, props))
  }

  return ret
}

// --- locals -------------------------------------------------------

class Memo extends Preact.Component {
  // TODO - handle ref and check handling of children
  // see https://github.com/preactjs/preact/blob/master/compat/src/index.js#L346
  shouldComponentUpdate(nextProps) {
    return shallowDiffers(this.props, nextProps)
  }
  render() {
    return this.props.children
  }
}

Memo.displayName = 'Memo'

function shallowDiffers(a, b) {
  for (let k in a) {
    if (!(k in b)) return true
  }

  for (let k in b) {
    if (k !== 'children' && a[k] !== b[k]) return true
  }

  return false
}



// --- exports ------------------------------------------------------

export default defineComponent
