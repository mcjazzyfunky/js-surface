import Props from './types/Props'
import Methods from './types/Methods'
import PropertiesConfig from './types/PropertiesConfig'
import ComponentConfig from './types/ComponentConfig'
import ComponentFactory from './types/ComponentFactory'
import h from './h'
import { Spec, SpecValidator } from 'js-spec'
import { metadata } from 'src/modules/svg/main';

function defineComponent<P extends Props = {}, M extends Methods = {}>(
  config: ComponentConfig<P>): ComponentFactory<P, M>

function defineComponent(config: any): any {
  const createInternalType = (defineComponent as any).__apply

  if (!createInternalType) {
    throw new Error('[defineComponent] Adapter has not been initialized')
  }

  if (process.env.NODE_ENV === 'development' as any) {
    const error = validateComponentConfig(config)

    if (error) {
      throw new Error(
        `[defineComponent] ${error.message}`)
    }
  }

  let createComponentElement: Function = null

  const ret = function (/* arguments */) {
    return createComponentElement.apply(null, arguments)
  }
  
  createComponentElement = h.bind(null, ret)

  Object.defineProperty(ret, 'js-surface:kind', {
    value: 'componentFactory'
  })
  
  Object.defineProperty(ret, 'js-surface:id', {
    value: nextId++
  })

  const meta = convertConfigToMeta(config)

  Object.defineProperty(ret, 'meta', {
    value: convertConfigToMeta(meta)
  })

  Object.defineProperty(ret, '__internal_type', {
    value: createInternalType(ret)
  })

  return ret
}

export default defineComponent

// --- locals ---------------------------------------------------

let nextId = 1

const
  REGEX_DISPLAY_NAME = /^([a-z]+:)*[A-Z][a-zA-Z0-9.]*$/,
  REGEX_PROP_NAME = /^[a-z][a-zA-Z0-9]*$/

let
  specOfPropertiesConfig: SpecValidator,
  specOfDefaultProps: SpecValidator,
  specOfComponentConfig: SpecValidator,
  validateComponentConfig: (config: any) => Error  | null

if (process.env.NODE_ENV === 'development' as any) {
  specOfPropertiesConfig =
    Spec.and(
      Spec.object,
      Spec.keysOf(Spec.match(REGEX_PROP_NAME)),

      Spec.valuesOf(
        Spec.and(
          Spec.strictShape({
            type: Spec.optional(Spec.function),
            nullable: Spec.optional(Spec.boolean),
            validate: Spec.optional(Spec.function),
            required: Spec.optional(Spec.boolean),
            defaultValue: Spec.optional(Spec.any)
          }),

          (propConfig: PropertiesConfig<any>) => {
            const
              required = propConfig.required,
              hasRequiredParam = propConfig.hasOwnProperty('required'),
              hasDefaultValue = propConfig.hasOwnProperty('defaultValue')

            let errorMsg = null

            if (hasRequiredParam && hasDefaultValue) {
              errorMsg = 'The parameters "required" and "defaultValue" must '
                + 'not be set both at once'
            } else if (required === false) {
              errorMsg = 'Please do not provide "required: false" as this is redundant'
            }

            return errorMsg ? new Error(errorMsg) : null
          })))

  specOfDefaultProps =
    Spec.and(
      Spec.object,
      Spec.hasSomeKeys,
      Spec.keysOf(Spec.match(REGEX_PROP_NAME)))

  specOfComponentConfig = 
    Spec.strictShape({
      displayName: Spec.match(REGEX_DISPLAY_NAME),
      properties: Spec.optional(specOfPropertiesConfig),
      defaultProps: Spec.optional(specOfDefaultProps),
      variableProps: Spec.optional(Spec.boolean),
      validate: Spec.optional(Spec.function),
      render: Spec.function
    })

  validateComponentConfig = (config: any): null | Error => {
    let ret = null
    const error = specOfComponentConfig.validate(config)

    if (error) {
      let errorMsg = 'Invalid configuration for component'

      if (config && typeof config.displayName === 'string'
        && config.displayName.match(REGEX_DISPLAY_NAME)) {

        errorMsg += ` "${config.displayName}"`
      }

      errorMsg += ` => ${error.message}`

      ret = new Error(errorMsg)
    }

    return ret
  }
}

function convertConfigToMeta(config: any): any {
  const ret: any = {
    displayName: config.displayName
  }

  if (config.properties) {
    ret.properties = {}
    const keys = Object.keys(config.properties)

    for (let i = 0; i < keys.length; ++i) {
      const key = keys[i]

      ret.properties[key] =
        Object.freeze(Object.assign({}, config.properties[key]))
    }
  }

  if (config.defaultProps) {
    const keys = Object.keys(config.defaultProps)

    ret.defaultProps = {}

    for (let i = 0; i < keys.length; ++i) {
      const key = keys[i]

      ret.defaultProps[key] = config.defaultProps[key]
    }

    Object.freeze(ret.defaultProps)
  }

  if (config.render) {
    ret.render = config.render
  } else {
    ret.init = config.init

    if (config.methods) {
      ret.methods = Object.freeze(config.methods.slice(0))
    }
  }

  return Object.freeze(ret)
}
