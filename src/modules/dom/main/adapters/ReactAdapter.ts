import React from 'react'
import ReactDOM from 'react-dom'

import Adapter from '../types/Adapter'

const ReactAdapter: Adapter = {
  createElement: React.createElement,
  createContext: React.createContext,
  forwardRef: React.forwardRef,

  useContext: React.useContext,
  useEffect: React.useEffect,
  useState: React.useState,
  useMethods: React.useImperativeMethods,

  mount: ReactDOM.render,
  unmount: ReactDOM.unmountComponentAtNode,

  Fragment: React.Fragment
}

export default ReactAdapter
