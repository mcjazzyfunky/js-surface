import Context from './types/Context'
import Methods from './types/Methods'

interface Dispatcher {
  useState<T>(init: () => T): [T, (newValue: T) => void],
  useEffect(effect: () => void, inputs?: any[]): void,
  useContext<T>(ctx: Context<T>): T,
  useMethods<M extends Methods>(ref: any, getMethods: () => M): void
}

let globalDispatcher: Dispatcher = null

const Dispatcher: Dispatcher & { init: (dispatcher: Dispatcher) => void } = Object.freeze({
  init(dispatcher: Dispatcher): void {
    if (dispatcher === null || typeof dispatcher !== 'object') {
      throw new Error('[Dispatcher.init] First argument "dispatcher" must be an object')
    }

    for (const method of ['useState', 'useEffect', 'useContext']) {
      if (typeof (dispatcher as any)[method] !== 'function') {
        throw new Error(`[Dispatcher.init] First argument "dispatcher" must have a method "${method}"`)
      }
    }

    if (globalDispatcher) {
      throw new Error('[Dispatcher.init] Dispatcher has already been initialized')
    }

    globalDispatcher = dispatcher
  },

  useState<T>(init: () => T): [T, (newValue: T) => void] {
    if (globalDispatcher === null) {
      throw new Error('[Dispatcher.useState] Dispatcher has not been initalized')
    }

    return globalDispatcher.useState(init)
  },

  useEffect(effect: () => void, inputs?: any[]): void {
    if (globalDispatcher === null) {
      throw new Error('[Dispatcher.useEffect] Dispatcher has not been initalized')
    }

    // TODO
    if (inputs === null || inputs === undefined) {
      globalDispatcher.useEffect(effect)
    } else {
      globalDispatcher.useEffect(effect, inputs)
    }
  },
  
  useContext<T>(ctx: Context<T>): T {
    if (globalDispatcher === null) {
      throw new Error('[Dispatcher.useContext] Dispatcher has not been initalized')
    }

    return globalDispatcher.useContext(ctx)
  },

  useMethods<M extends Methods>(ref: any, getMethods: () => M): void {
    if (globalDispatcher === null) {
      throw new Error('[Dispatcher.useMethods] Dispatcher has not been initalized')
    }

    return globalDispatcher.useMethods(ref, getMethods)
  }
})

export default Dispatcher
