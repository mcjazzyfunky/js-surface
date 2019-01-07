import Context from './types/Context'

interface Dispatcher {
  useState<T>(init: () => T): [T, (newValue: T) => void],
  useEffect(effect: () => void, inputs?: any[]): void,
  useContext<T>(ctx: Context<T>): T,
}

let dispatcher: Dispatcher = null

const Dispatcher: Dispatcher & { init: (handler: Dispatcher) => void }= Object.freeze({
  init(handler: Dispatcher): void {
    if (handler === null || typeof handler !== 'object') {
      throw new Error('[Dispatcher.init] First argument "handler" must be an object')
    }

    for (const method of ['useState', 'useEffect', 'useContext']) {
      if (typeof (handler as any)[method] !== 'function') {
        throw new Error(`[Dispatcher.init] First argument "handler" must have a method "${method}"`)
      }
    }

    dispatcher = handler
  },

  useState<T>(init: () => T): [T, (newValue: T) => void] {
    if (dispatcher === null) {
      throw new Error('[Dispatcher.useState] Dispatcher has not been initalized')
    }

    return dispatcher.useState(init)
  },

  useEffect(effect: () => void, inputs?: any[]): void {
    if (dispatcher === null) {
      throw new Error('[Dispatcher.useEffect] Dispatcher has not been initalized')
    }

    dispatcher.useEffect(effect, inputs)
  },
  
  useContext<T>(ctx: Context<T>): T {
    if (dispatcher === null) {
      throw new Error('[Dispatcher.useContext] Dispatcher has not been initalized')
    }

    return dispatcher.useContext(ctx)
  }
})

export default Dispatcher
