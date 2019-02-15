import { Dispatcher, Fragment } from '../../core/main'
import adaptMount from './adpation/adaptMount'
import adaptUnmount from './adpation/adaptUnmount'

import adapter from './adapters/ReactAdapter'
// import adapter from './adapters/DyoAdapter'
// import adapter from './adapters/PreactAdapter'

Dispatcher.init({
  useContext(ctx: any) {
    if (!ctx.Provider.__internal_type) {
      const result = adapter.createContext(ctx.Provider.meta.properties.value.defaultValue)

      result.Provider._context = result
      result.Consumer._context = result
      
      Object.defineProperty(ctx.Provider, '__internal_type', {
        value: result.Provider
      })

      Object.defineProperty(ctx.Consumer, '__internal_type', {
        value: result.Consumer
      })

    }

    return adapter.useContext(ctx.Provider.__internal_type._context)
  },

  useEffect: adapter.useEffect,
  useMethods: adapter.useMethods,
  useState: adapter.useState
})

Object.defineProperty(Fragment, '__internal_type', {
  value: adapter.Fragment
})

const
  mount = adaptMount(adapter),
  unmount = adaptUnmount(adapter)

export {
  mount,
  unmount
}

