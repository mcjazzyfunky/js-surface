import { KEY_INTERNAL_TYPE, KEY_INTERNAL_DEFAULTS } from '../internal/constant/constants'
import validateComponentConfig from '../internal/validation/validateComponentConfig'
import createElement from './createElement'
import preact from 'preact'
import defineHiddenProperty from '../internal/helper/defineHiddenProperty'

export default function defineComponent(config) {
  if (process.env.NODE_ENV === 'development') {
    const error = validateComponentConfig(config)

    if (error) {
      const errorMsg = prettifyErrorMsg(error.message, config)

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
          injectedContexts.push(inject.context)
        }

        contextInfoPairs.push([propName, index])
      }
    }

    if (injectedContexts.length > 0) {
      const innerComponentType = internalType

      const render = function (props) {
        const
          contextValues = new Array(injectedContexts.length),
          adjustedProps = Object.assign({}, props)

        let node = null

        for (let i = 0; i < injectedContexts.length; ++i) {
          if (i === 0) {
            node = preact.createElement(injectedContexts[0].Consumer[KEY_INTERNAL_TYPE], null, value => {
              contextValues[0] = value

              for (let j = 0; j < contextInfoPairs.length; ++j) {
                let [propName, contextIndex] = contextInfoPairs[i]

                if (props[propName] === undefined) {
                  adjustedProps[propName] = contextValues[contextIndex]
                }
              }

              return preact.createElement(innerComponentType, adjustedProps)
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

      internalType =
        config.render 
          ? render
          : class extends preact.Component {
            constructor(props) {
              super(props)
              
              this.__meta = normalizedConfig
              this.__innerComponent = null

              if (config.methods) {
                this.__setInnerComponent = this.setInnerComponent.bind(this)
              }
            }

            __setInnerComponent(ref) {
              this.__innerComponent = ref
            }

            render() {
              const props = this.props

              if (config.methods) {
                props.ref = this.setInnerComponent
              }

              return render(props)
            }
          }

      internalType.displayName = config.displayName + '(container)'

      if (config.methods) {
        for (let i = 0; i < config.methods.length; ++i) {
          const methodName = config.methods[i]

          internalType.prototype[methodName] =
            function(...args) {
              return this.__innerComponent[methodName](...args)
            }
        }
      }
    }
  }

  internalType.displayName = config.displayName

  const ret = (function () {
    let createComponentElement = null

    return function () {
      if (createComponentElement === null) {
        createComponentElement = createElement.bind(null, ret)
      }

      return createComponentElement.apply(null, arguments)
    }
  }())

  let defaults = null

  if (config.properties) {
    for (const propName in config.properties) {
      if (config.properties.hasOwnProperty(propName)) {
        const propConfig = config.properties[propName]
        
        if (propConfig.hasOwnProperty('defaultValue')) {
          defaults = defaults || []

          defaults.push([propName, () => propConfig.defaultValue])
        }
      }
    }
  }

  defineHiddenProperty(internalType, KEY_INTERNAL_DEFAULTS, defaults)
  defineHiddenProperty(ret, KEY_INTERNAL_TYPE, internalType)

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
      + `"${config.displayName}" => ${errorMsg} `
    : `[defineComponent] Invalid component configuration => ${errorMsg}`
}

function deriveComponent(config) {
  return config.hasOwnProperty('render')
    ? deriveSimpleComponent(config)
    : deriveAdvancedComponent(config)
}

function deriveSimpleComponent(config) {
  return config.render.bind()
}

function deriveAdvancedComponent(config) {
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

  return Component
}
