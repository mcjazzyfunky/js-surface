import { Spec } from 'js-spec'

import Context from './types/Context'
import ContextConfig from './types/ContextConfig'
import ContextOptions from './types/ContextOptions'

function context<T>(config: ContextConfig<T>): Context<T>

function context<T>(
  displayName: string,
  defaultValue?: T,
  options?: ContextOptions
): Context<T>

function context<T>(arg1: any, arg2?: any, arg3?: any): Context<T> {
  const buildContext = (context as any).__apply
  
  if (!buildContext) {
    throw new Error('[context] Adapter has not been initialized')
  }

  let errorMsg: string

  if (process.env.NODE_ENV === 'development' as any) {
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
    ? buildContext(arg1, arg2, arg3.validate)
    : buildContext(arg1.displayName, arg1.defaultValue, arg1.validate)
}

// --- locals -------------------------------------------------------

let
  validateContextConfig: (config: any) => null | Error,
  validateContextOptions: (options: any) => null | Error

if (process.env.NODE_ENV === 'development' as any) {
  const REGEX_DISPLAY_NAME = /^([a-z]+:)*[A-Z][a-zA-Z0-9.]*$/

  validateContextConfig =
    Spec.exact({
      displayName: Spec.match(REGEX_DISPLAY_NAME),
      defaultValue: Spec.optional(Spec.any),
      validate: Spec.optional(Spec.function)
    })

  validateContextOptions =
    Spec.exact({
      validate: Spec.optional(Spec.function)
    })
}

// --- exports ------------------------------------------------------

export default context
