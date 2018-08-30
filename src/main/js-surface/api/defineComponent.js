import validateComponentConfig from '../internal/validation/validateComponentConfig'
import validateProperty from '../internal/validation/validateProperty'
import printError from '../internal/helper/printError'
import createElement from './createElement'

import preact from 'preact'

export default function defineComponent(config) {
  if (process.env.NODE_ENV === 'development') {
    const error = validateComponentConfig(config)

    if (error) {
      const errorMsg = prettifyErrorMsg(error.message, config)

      printError(errorMsg)
      throw new TypeError(errorMsg)
    }
  }

  const normalizedConfig = Object.assign({}, config)

  if (config.hasOwnProperty('main')) {
    // TODO - make this nicer

    let result

    if (typeof config.main.normalizeComponent === 'function') {
      result = config.main.normalizeComponent(config)
    } else {console.log(config)
      result = config.main(config)
    }

    Object.assign(normalizedConfig, result)

    delete normalizedConfig.main
  }

  let internalType = deriveComponent(normalizedConfig)

  if (config.properties) {
    const
      propNames = Object.keys(config.properties),
      injectedContexts = [],
      contextInfoPairs = []

    for (let i = 0; i < propNames.length; ++i) {
      const
        propName = propNames[i],
        propConfig = config.properties[propName],
        inject = propConfig.inject

      if (inject) {
        let index = injectedContexts.indexOf(inject)

        if (index === -1) {
          index = injectedContexts.length
          injectedContexts.push(inject)
        }

        contextInfoPairs.push([propName, index])
      }
    }

    if (injectedContexts.length > 0) {
      const innerComponent = internalType

      internalType = class CustomComponent extends preact.Component {
        constructor(props) {
          super(props)

          this.__meta = normalizedConfig
        }

        render() {
          const
            contextValues = new Array(injectedContexts.length),
            adjustedProps = Object.assign({}, this.props)

          let node = null

          for (let i = 0; i < injectedContexts.length; ++i) {
            if (i === 0) {
              node = preact.createElement(injectedContexts[0].Consumer.__internal_type, null, value => {
                contextValues[0] = value

                for (let j = 0; j < contextInfoPairs.length; ++j) {
                  let [propName, contextIndex] = contextInfoPairs[i]

                  if (this.props[propName] === undefined) {
                    adjustedProps[propName] = contextValues[contextIndex]
                  }
                }

                return preact.createElement(innerComponent, adjustedProps)
              })
            } else {
              const currNode = node
              
              node = preact.createElement(injectedContexts[i].Consumer, null, value => {
                contextValues[i] = value

                return currNode
              })
            }
          }

          return node
        }
      }

      internalType.displayName = config.displayName + '-wrap'

      if (config.methods) {
        for (let i = 0; i < config.methods.length; ++i) {
          const methodName = config.methods[i]

          internalType.prototype[methodName] =
            (...args) => innerComponent[methodName](...args)
        }
      }
    }
  }

  const ret = (function () {
    let createComponentElement = null

    return function () {
      if (createComponentElement === null) {
        createComponentElement = createElement.bind(null, ret)
      }

      return createComponentElement.apply(null, arguments)
    }
  }())

  Object.defineProperty(ret, '__internal_type', {
    enumerable: false,
    value: internalType
  })

  ret.meta = normalizedConfig

  Object.freeze(ret.meta)
  Object.freeze(ret)

  return ret
}

function prettifyErrorMsg(errorMsg, config) {
  return config && typeof config === 'object'
    && typeof config.displayName === 'string'
    && config.displayName.trim().length > 0
    ? '[defineComponent] Invalid configuration for component '
      + `"${config.displayName}": ${errorMsg} `
    : `[defineComponent] Invalid component configuration: ${errorMsg}`
}

function deriveComponent(config) {
  return config.hasOwnProperty('render')
    ? deriveSimpleComponent(config)
    : deriveAdvancedComponent(config)
}

function deriveSimpleComponent(config) {
  return Object.assign(
    config.render.bind(),
    convertConfig(config))
}

function deriveAdvancedComponent(config) {
  // config is already normalized

  const convertedConfig = convertConfig(config)

  class Component extends preact.Component {
    constructor(props) {
      super(props)

      this.__meta = config
      this.__isInitialized = false
      this.__handleError = null
      this.__callbacksWhenBeforeUpate = []

      const
        getProps = () => !this.__isInitialized ? props : this.props,
        getState = () => this.state,

        updateState = (updater, callback) => {
          if (updater) { 
            if (!this.__isInitialized) {
              const stateUpdates =
                typeof updater === 'object'
                  ? updater
                  : updater(this.state)

              this.state = Object.assign(this.state || {}, stateUpdates)

              if (callback) {
                callback()
              }
            } else {
              this.setState(updater, callback)
            }
          }
        },

        forceUpdate = this.forceUpdate.bind(this)

      const result = config.init(getProps, getState, updateState, forceUpdate)

      this.componentDidMount = () => {
        this.__isInitialized = true

        if (result.afterUpdate) {
          result.afterUpdate(null, null)
        }
      }

      if (result.afterUpdate) {
        this.componentDidUpdate = (prevProps, prevState) => {
          result.afterUpdate(prevProps, prevState)
        }
      }

      if (result.finalize) {
        this.componentWillUnmount = () => {
          result.finalize()
        }
      }

      if (result.proxy) {
        this.__proxy = result.proxy
      }

      this.__handleError = result.handleError || null

      if (result.needsUpdate) {
        this.shouldComponentUpdate = (nextProps, nextState) => {
          return result.needsUpdate(nextProps, nextState)
        }
      }

      this.render = result.render

      if (config.methods) {
        for (const methodName of config.methods) {
          Component.prototype[methodName] = function (/*arguments*/) {
            return result.proxy[methodName].apply(result.proxy, arguments)
          }
        }
      }

      if (this.__callbacksWhenBeforeUpate.length > 0) {
        const callbacks = this.__callbacksWhenBeforeUpate
        
        this.__callbacksWhenBeforeUpate = []

        for (let i = 0; i < callbacks.length; ++i) {
          callbacks[i](this.props, this.state)
        }
      }
    }
  }
  
  if (config.deriveStateFromProps) {
    Component.getDerivedStateFromProps = (props, state) => {
      return config.deriveStateFromProps(props, state)
    }
  }

  if (config.isErrorBoundary) {
    Component.prototype.componentDidCatch = function (error, info) {
      this.__handleError(error, info)
    }
  }

  Object.assign(Component, convertedConfig)

  return Component
}

function convertConfig(config) {
  // config is already normalized

  const ret = {
    displayName: config.displayName,
    defaultProps: {},
  }

  ret.displayName = config.displayName

  if (config.properties) {
    for (const propName of Object.keys(config.properties)) {
      const propCfg = config.properties[propName]

      if (propCfg.hasOwnProperty('defaultValue') && propCfg.defaultValue === undefined) {
        ret.defaultProps[propName] = undefined
      } else if (propCfg.defaultValue !== undefined) {
        ret.defaultProps[propName] = propCfg.defaultValue
      } else if (propCfg.getDefaultValue) {
        Object.defineProperty(ret.defaultProps, propName, {
          enumerable: true,

          get: () => propCfg.getDefaultValue()
        })
      }
    }
  }

  if (process.env.NODE_ENV === 'development') {
    ret.propTypes = {
      '*': props => {
        let result = null

        const
          propNames = config.properties ? Object.keys(config.properties) : [],
          messages = [],
          normalizedProps = props

        if (config.properties) {
          for (let i = 0; i < propNames.length; ++i) {
            const
              propName = propNames[i],
              propValue = normalizedProps[propName],
              propConfig = config.properties[propName],
              result = validateProperty(propValue, propName, propConfig)

            if (result) {
              messages.push(result.message)
            }
          }
        }

        const
          usedPropNames = Object.keys(props),
          invalidPropNames = []

        for (let i = 0; i < usedPropNames.length; ++i) {
          const usedPropName = usedPropNames[i]

          if (!config.properties.hasOwnProperty(usedPropName)) {
            invalidPropNames.push(usedPropName)
          }
        }

        if (invalidPropNames.length == 1) {
          messages.push(`Invalid prop key "${invalidPropNames[0]}"`)
        } else if (invalidPropNames.length > 1) {
          messages.push('Invalid prop keys: ' + invalidPropNames.join(', '))
        }

        if (config.validate) {
          const error = config.validate(normalizedProps)

          if (error) {
            messages.push(error instanceof Error ? error.message : String(error))
          }
        }

        if (messages.length === 1) {
          result = new Error(messages[0])
        } else if (messages.length > 1) {
          result = new Error(`\n- ${messages.join('\n- ')}`)
        }

        return result
      }
    }
  }

  return ret
}

