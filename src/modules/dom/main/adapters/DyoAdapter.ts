import * as Dyo from 'dyo'

import { Context } from '../../../core/main'

import Adapter from '../types/Adapter'

const DyoAdapter: Adapter = {
  name: 'dyo',
  api: Dyo,
  createElement: Dyo.createElement,
  createContext: Dyo.createContext,
  Fragment: Dyo.Fragment,
  useContext: (ctx: Context<any>) => Dyo.useContext(ctx)[0],
  useEffect: Dyo.useEffect,
  useState: Dyo.useState,
  
  useMethods(ref: any, getHandler: Function) {
    const handler = getHandler() // TODO

    if (ref && typeof ref === 'object') {
      ref.current = handler
    } else if (typeof ref === 'function') {
      ref(handler)
    }
  },

  mount: Dyo.render,
  unmount: Dyo.unmountComponentAtNode,
}

export default DyoAdapter
