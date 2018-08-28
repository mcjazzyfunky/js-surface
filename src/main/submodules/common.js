function view(render) {
  return (/* config */) => {
    // TODO - check config
    
    return {
      functional: true,
      render
    }
  }
}

class Component {
  constructor() {
    Object.defineProperty(this, '___internals', {
      enumerable: false,
      writeable: false,

      value: {
        getProps: null,
        getState: null,
        initialState: null,
        updateState: null,
        forceUpdate: null,
        render: null,
        beforeUpdate: null,
        afterUpdate: null
      }
    })
  }

  get props() {
    const getProps = this.___internals.getProps; 

    return getProps ? getProps() : null
  }

  get state() {
    const getState = this.___internals.getState

    return getState ? getState() : null
  }

  set state(state) {
    if (this.___internals.updateState) {
      throw new Error(
        'Component state cannot be set directly from outside of constructor '
          + '- use setState instead')
    } else {
      this.___internals.initialState = state
    }
  }

  getSnapshotBeforeUpdate(/* prevProps, prevState */) {
    return null
  }

  componentDidMount() {
  }

  componentDidUpdate(/* prevProps, prevState, snapshot */) {
  }

  componentWillUnmount() {
  }

  componentDidCatch(/* error, info */) {
  }

  shouldComponentUpdate(/* nextProps, nextState */) {
    return true
  }

  render() { 
    return null
  }

  setState(firstArg, callback) {
    if (!this.___internals.updateState) {
      throw new Error('Calling setState within the constructor is not allowed')
    } else {
      const
        typeOfFirstArg = typeof firstArg,
        firstArgIsFunction = typeOfFirstArg === 'function',
        firstArgIsObject = firstArg !== null && typeOfFirstArg === 'object'

      if (firstArgIsFunction || firstArgIsObject) {
        const updater = firstArgIsObject ? () => firstArg : firstArg

        this.___internals.updateState(updater, callback)
      } else {
        throw new TypeError('First argument of setState must either be a function or an object')
      }
    }
  }

  forceUpdate(callback) {
    if (this.___internals.forceUpdate) {
      this.___internals.forceUpdate(callback)
    }
  }

  static derivedStateFromProps(/* nextProps, prevState */) {
    return null
  }

  static normalizeComponent(config) {
    const CustomComponent = this

    const ret = {
      functional: false,

      init(getProps, getState, updateState, forceUpdate) {
        const component = new CustomComponent(getProps())
        
        let isInitialized = false

        updateState(() => component.___internals.initialState)

        component.___internals.getProps = getProps
        component.___internals.getState = getState
        component.___internals.updateState = updateState
        component.___internals.forceUpdate = forceUpdate
        
        const result = {
          render: component.render.bind(component),
          finalize: component.componentWillUnmount.bind(component),
          needsUpdate: component.shouldComponentUpdate.bind(component),

          afterUpdate: (prevProps, prevState) => {
            if (!isInitialized) {
              isInitialized = true
              component.componentDidMount()
            } else {
              component.componentDidUpdate(prevProps, prevState)
            }
          }
        }

        if (config.methods) {
          result.proxy = {}

          for (let i = 0; i < config.methods; ++i) {
            const methodName = config.methods[i]

            result.proxy[methodName] = (...args) => {
              return component[methodName](...args)
            }
          }
          
          Object.freeze(result.proxy)
        }

        if (config.isErrorBoundary) {
          result.handleError = component.componentDidCatch.bind(component)
        }

        return result
      }
    }

    if (config.main.deriveStateFromProps !== Component.deriveStateFromProps) {
      ret.deriveStateFromProps = config.main.deriveStateFromProps
    }

    return ret
  }
}

// --- exports ------------------------------------------------------

export default Object.freeze({
  view,
  Component
})

export {
  view,
  Component
}
