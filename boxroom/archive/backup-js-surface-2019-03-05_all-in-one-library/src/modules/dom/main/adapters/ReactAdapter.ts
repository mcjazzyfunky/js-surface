import React from 'react'
import ReactDOM from 'react-dom'
import Adapter from '../types/Adapter'

const ReactAdapter: Adapter = {
  name: 'react',
  api: React,

  createElement(...args: any) {
    if (args.length > 1) {
      const
        type = args[0],
        props = args[1]

      if (typeof type === 'string' && props && props.innerHTML) {
        args[1] = { ...props, dangerouslySetInnerHTML: {__html: props.innerHTML } }
        delete args[1].innerHTML
      }
    }

    return React.createElement.apply(null, args)
  },

  createContext: React.createContext,
  forwardRef: React.forwardRef,
  Fragment: React.Fragment,
  useContext: React.useContext,
  useEffect: React.useEffect,
  useState: React.useState,
  useMethods: React.useImperativeHandle,

  mount: ReactDOM.render,
  unmount: ReactDOM.unmountComponentAtNode,
}

export default ReactAdapter
