import ContextConfig from './types/ContextConfig'
import { Spec, SpecValidator } from 'js-spec'
import Context from './types/Context'
import PropertyConfig from './types/PropertyConfig'
import PropertiesConfig from './types/PropertiesConfig'
import VirtualElement from './types/VirtualElement'
import createElement from './createElement'

export default function defineContext<T>(config: ContextConfig<T>): Context<T> {
  let error: Error | null = null
  
  if (process.env.NODE_ENV === 'development' as any) {
    error = validateContextConfig(config)

    if (error) {
      throw new Error(`[defineContext] ${error.message}`)
    }
  }

  const
    providerValuePropertyConfig: PropertyConfig<T> = {},
    providerPropertiesConfig: PropertiesConfig<{ value: T }> = {
      value: providerValuePropertyConfig
    }

  if (config.hasOwnProperty('type')) {
    providerValuePropertyConfig.type = config.type
  }

  if (config.hasOwnProperty('nullable')) {
    providerValuePropertyConfig.nullable = config.nullable
  }

  if (config.hasOwnProperty('validate')) {
    providerValuePropertyConfig.validate = config.validate
  }

  let
    createProvider: (...args: any[]) => VirtualElement = null,
    createConsumer: (...args: any[]) => VirtualElement = null

  let ret: Context<T> = {
    Provider(...args: any[]): VirtualElement {
      if (createProvider === null) {
        createProvider = createElement.bind(null, ret.Provider)
      }

      return createProvider(...args)
    },

    Consumer(...args: any[]): VirtualElement {
      if (createConsumer === null) {
        createConsumer = createElement.bind(null, ret.Consumer)
      }

      return createConsumer(...args)
    }
  } as any as Context<T>
  
  Object.defineProperty(ret, 'js-surface:kind', {
    value: 'context'
  })

  Object.defineProperty(ret.Provider, 'js-surface:kind', {
    value: 'contextProvider'
  })

  Object.defineProperty(ret.Consumer, 'js-surface:kind', {
    value: 'contextConsumer'
  })
  
  Object.defineProperty(ret.Provider, 'meta', {
    value: Object.freeze({
      displayName: `${config.displayName}.Provider`,
      properties: Object.freeze(providerPropertiesConfig),
      render: ret.Provider
    }) 
  })

  Object.defineProperty(ret.Consumer, 'meta', {
    value: Object.freeze({
      displayName: `${config.displayName}.Consumer`,
      properties: Object.freeze({}),
      render: ret.Provider
    }) 
  })

  return ret
}

// --- locals -------------------------------------------------------

const REGEX_DISPLAY_NAME = /^([a-z]+:)*[A-Z][a-zA-Z0-9.]*$/

let contextConfigSpec: SpecValidator = null

if (process.env.NODE_ENV === 'development' as any) {
  contextConfigSpec =
    Spec.strictShape({
      displayName: Spec.match(REGEX_DISPLAY_NAME),
      type: Spec.optional(Spec.function),
      nullable: Spec.optional(Spec.boolean),
      validate: Spec.optional(Spec.function),
      defaultValue: Spec.any
    })
}

function validateContextConfig<T>(config: ContextConfig<T>): Error | null {
  let ret = null

  const error = contextConfigSpec.validate(config)

  if (error) {
    let errorMsg = 'Invalid configuration for context'

    if (config && typeof config.displayName === 'string'
      && config.displayName.match(config.displayName)) {
      
      errorMsg += ` "${config.displayName}"`
    }

    errorMsg += ` => ${error.message}`

    ret = new Error(errorMsg)
  }

  return ret
}

