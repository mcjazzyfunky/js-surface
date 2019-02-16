import * as Dyo from 'dyo'

import { Context } from '../../../core/main'

import Adapter from '../types/Adapter'
import { pseudoRandomBytes } from 'crypto';

const DyoAdapter: Adapter = {
  name: 'dyo',
  api: Dyo,
  createElement: Dyo.createElement,
  
  createContext(defaultValue: any) {
    const ret = Dyo.createContext
    
    ret.Provider = (props: any) => {
      const [, provide] = Dyo.useContext(ret)

      provide(props.value)
      return props.children
    }

    ret.Consumer = (props: any) => {
      const [value] = Dyo.useContext(ret)

      return props[0](value)
    }

    return ret
  },

  forwardRef(f: (props: any, ref: any) => any) {
    return (props: any) => f(props, props ? props.ref : undefined)
  },

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
