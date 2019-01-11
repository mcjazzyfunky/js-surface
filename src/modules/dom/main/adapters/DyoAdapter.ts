import * as Dyo from 'dyo'

import Adapter from '../types/Adapter'

const DyoAdapter: Adapter = {
  createElement: Dyo.createElement,
  createContext: Dyo.createContext,
  forwardRef: Dyo.forwardRef,

  useContext: (): any => null, // Dyo.useContext,
  useEffect: (): any => null, // Dyo.useEffect,
  useState: (): any => [{}, () => {}], // Dyo.useState,
  useMethods: (): any => null, // Dyo.useImperativeMethods,

  mount: Dyo.render,
  unmount: Dyo.unmountComponentAtNode,

  Fragment: Dyo.Fragment
}

export default DyoAdapter
