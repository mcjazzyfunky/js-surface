// external imports
import * as Spec from 'js-spec/validators'

// internal imports
import defineContext from '../internal/adaption/dyo/defineContext'

// --- context ------------------------------------------------------

function context(arg1, arg2, arg3) {
  let errorMsg

  if (process.env.NODE_ENV === 'development') {
    if (arg1 && typeof arg1 === 'object') {
      if (arguments.length > 1) {
        errorMsg = 'Unexpected second argument'
      } else {
        const result = validateContextConfig(arg1)

        if (result) {
          errorMsg = 'Invalid context configuration: ' + result.message
        }
      }
    } else if (typeof arg1 !== 'string') {
      errorMsg = 'Expected a string or an object as first argument'
    } else if (arguments.length > 2 && (!arg3 || typeof arg3 !== 'object')) {
      errorMsg = 'Expected an object as third argument'
    } else if (arg3) {
      const result = validateContextOptions(arg3)

      if (result) {
        errorMsg = 'Invalid context options: ' + result.message
      }
    }

    if (errorMsg) {
      throw new Error(`[context] ${errorMsg}`)
    }
  }

  return typeof arg1 === 'string'
    ? defineContext(arg1, arg2, arg3.validate)
    : defineContext(arg1.displayName, arg1.defaultValue, arg1.validate)
}

// --- locals -------------------------------------------------------

let
  validateContextConfig,
  validateContextOptions

if (process.env.NODE_ENV === 'development') {
  const REGEX_DISPLAY_NAME = /^([a-z]+:)*[A-Z][a-zA-Z0-9.]*$/

  validateContextConfig =
    Spec.exact({
      displayName: Spec.match(REGEX_DISPLAY_NAME),
      defaultValue: Spec.optional(Spec.any),
      validate: Spec.optional(Spec.func)
    })

  validateContextOptions =
    Spec.exact({
      validate: Spec.optional(Spec.func)
    })
}

// --- exports ------------------------------------------------------

export default context
