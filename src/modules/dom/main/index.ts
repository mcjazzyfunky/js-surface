import { Dispatcher, Fragment } from '../../core/main'
import { convertContext } from './adpation/adaptMount' // TODO
import adaptMount from './adpation/adaptMount'
import adaptUnmount from './adpation/adaptUnmount'

import adapter from './adapters/ReactAdapter'
// import adapter from './adapters/PreactAdapter'

Dispatcher.init({
  useContext(ctx: any) {
    if (!ctx.Provider.__internal_type) {
      convertContext(adapter, ctx)
    }

    return adapter.useContext(ctx.Provider.__internal_type._context) // TODO
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

