// internal imports
import createElement from '../internal/adaption/dyo/createElement'

// --- h ------------------------------------------------------------

function h(/* arguments */) {
  let ret

  const type = arguments[0]

  if (process.env.NODE_ENV === 'development') {
    if (type && typeof type !== 'string'
      && isReact // TODO
      && type.meta && type.meta.validate)
    {
      const
        props = arguments[1] || {},
        validate = type.meta.validate,
        result = validate(props)


      let errorMsg = null

      if (result === false) {
        errorMsg = 'Illegal props values'
      } else if (result instanceof Error) {
        errorMsg = result.message
      }

      if (errorMsg) {
        throw new Error(
          `Props validation error for component "${type.meta.name}" => `
            + errorMsg)
      }
    }
  }

  ret = createElement.apply(null, arguments)

  return ret
}

// --- locals -------------------------------------------------------

const isReact = !!createElement('div').$$typeof

// --- exports ------------------------------------------------------

export default h
