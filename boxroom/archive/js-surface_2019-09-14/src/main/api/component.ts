// external imports
import { Spec } from 'js-spec'

// internal imports
import Component from './types/Component'
import VirtualElement from './types/VirtualElement'
import VirtualNode from './types/VirtualNode' 
import Props from './types/Props'
import ComponentConfig from './types/ComponentConfig'
import ComponentOptions from './types/ComponentOptions'
import defineComponent from '../internal/adaption/dyo/defineComponent'

// --- component ----------------------------------------------------

function component<P extends Props>
  (config: ComponentConfig<P>): Component<P>

function component<P extends Props = {}>(
  displayName: string,
  renderer?: ComponentConfig<P>['render'], // TODO
  options?: ComponentOptions
): Component<P>

function component<P extends Props = {}>(
  arg1: any, arg2?: any, arg3?: any
): Component<P> {
  let errorMsg: string

  if (process.env.NODE_ENV === 'development' as any) {
    if (arg1 && typeof arg1 === 'object') {
      if (arguments.length > 1) {
        errorMsg = 'Unexpected second argument'
      } else {
        const result = validateComponentConfig(arg1)

        if (result) {
          errorMsg = 'Invalid component configuration: ' + result.message
        }
      }
    } else if (typeof arg1 !== 'string') {
      errorMsg = 'Expected a string or an object as first argument'
    } else if (arguments.length > 2 && (!arg3 || typeof arg3 !== 'object')) {
      errorMsg = 'Expected an object as third argument'
    } else if (arg3) {
      const result = validateComponentOptions(arg3)

      if (result) {
        errorMsg = 'Invalid component options: ' + result.message
      }
    }

    if (errorMsg) {
      throw new Error(`[component] ${errorMsg}`)
    }
  }

  let
    displayName: string,
    render: any, // TODO
    forwardRef: boolean,
    memoize: boolean,
    validate: any // TODO

  if (typeof arg1 === 'string') {
    displayName = arg1
    render = arg2,
    forwardRef = arg3 && arg3.forwardRef || false,
    memoize = arg3 && arg3.memoize || false,
    validate = arg3 && arg3.validate || null
  } else {
    displayName = arg1.displayName
    render = arg1.render,
    forwardRef = arg1.forwardRef,
    memoize = arg1.memoize || false,
    validate = arg1.validate || null
  }

  const ret: any = defineComponent(
    displayName,
    render,
    forwardRef,
    memoize,
    validate
  )

  Object.defineProperty(ret, 'meta', {
    value: Object.freeze({ displayName, render, memoize, validate })
  })

  return ret
}

// --- locals -------------------------------------------------------

let
  validateComponentConfig: (config: any) => null | Error,
  validateComponentOptions: (options: any) => null | Error

if (process.env.NODE_ENV) {
  const REGEX_DISPLAY_NAME = /^([a-z]+:)*[A-Z][a-zA-Z0-9.]*$/

  validateComponentConfig = Spec.exact({
    displayName: Spec.match(REGEX_DISPLAY_NAME),
    forwardRef: Spec.optional(Spec.boolean),
    memoize: Spec.optional(Spec.boolean),
    validate: Spec.optional(Spec.function),
    render: Spec.function
  })

  validateComponentOptions = Spec.exact({
    validate: Spec.optional(Spec.function),
    memoize: Spec.optional(Spec.boolean),
  })
}

// --- exports ------------------------------------------------------

export default component
