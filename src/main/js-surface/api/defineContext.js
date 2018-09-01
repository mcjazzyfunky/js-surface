import validateContextConfig from '../internal/validation/validateContextConfig'
import printError from '../internal/helper/printError'
import validateProperties from '../internal/validation/validateProperties'
import defineHiddenProperty from '../internal/helper/defineHiddenProperty'
import createElement from './createElement'
import preactContext from 'preact-context'

import {
  KEY_INTERNAL_TYPE,
  KEY_INTERNAL_CONTEXT,
  KEY_INTERNAL_IS_CTX_PROVIDER
} from '../internal/constant/constants'

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

  const ret = { Provider, Consumer }

  defineHiddenProperty(ret, KEY_INTERNAL_CONTEXT, internalContext)
  defineHiddenProperty(Provider, KEY_INTERNAL_IS_CTX_PROVIDER, true)
  defineHiddenProperty(Provider, KEY_INTERNAL_TYPE, internalProvider)
  defineHiddenProperty(Consumer, KEY_INTERNAL_TYPE, internalConsumer)

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
