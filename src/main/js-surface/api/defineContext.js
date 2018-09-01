import preactContext from 'preact-context'
import validateContextConfig from '../internal/validation/validateContextConfig'
import printError from '../internal/helper/printError'
import validateProperties from '../internal/validation/validateProperties'
import createElement from './createElement'

export default function defineContext(config) {
  if (process.env.NODE_ENV === 'development') {
    const error = validateContextConfig(config)

    if (error) {
      const errorMsg = prettifyErrorMsg(error.message, config)

      printError(errorMsg)
      throw new TypeError(errorMsg)
    }
  }

  const
    internalContext = preactContext.createContext(config.defaultValue),
    internalProvider = internalContext.Provider,
    internalConsumer = internalContext.Consumer,

    Provider = (function () {
      let createComponentElement = null

      return function () {
        if (createComponentElement === null) {
          createComponentElement = createElement.bind(null, Provider)
        }

        return createComponentElement.apply(null, arguments)
      }
    }()),
    
    Consumer = (function () {
      let createComponentElement = null

      return function () {
        if (createComponentElement === null) {
          createComponentElement = createElement.bind(null, Consumer)
        }

        return createComponentElement.apply(null, arguments)
      }
    }())

  if (process.env.NODE_ENV === 'development') {
    const
      oldRender = internalProvider.prototype.render,
      displayName = config.displayName,
      propsConfig = { value: config, children: { optional: true } } // TODO: optimize children validation

    internalProvider.prototype.render = function (props, state) {
      const result = validateProperties(props, propsConfig, null, displayName, true)

      if (result) {
        throw result
      }

      return oldRender.call(this, props, state)
    }
  }

  Object.defineProperty(Consumer, '__internal_isProvider', {
    enumerable: false,
    value: true
  })

  Object.defineProperty(Provider, '__internal_type', {
    enumerable: false,
    value: internalProvider
  })

  Object.defineProperty(Consumer, '__internal_type', {
    enumerable: false,
    value: internalConsumer
  })

  Object.defineProperty(Consumer, '__internal_isConsumer', {
    enumerable: false,
    value: true
  })

  const ret = { Provider, Consumer }

  Object.defineProperty(ret, '__internal_context', {
    enumerable: false,
    value: internalContext,
  })

  return Object.freeze(ret)
}

function prettifyErrorMsg(errorMsg, config) {
  return config && typeof config === 'object'
    && typeof config.displayName === 'string'
    && config.displayName.trim().length > 0
    ? '[defineContext] Invalid configuration for context '
      + `"${config.displayName}": ${errorMsg} `
    : `[defineContext] Invalid context configuration: ${errorMsg}`
}
