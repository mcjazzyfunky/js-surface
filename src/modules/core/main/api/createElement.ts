// internal imports
import Boundary from './Boundary'
import Fragment from './Fragment'
import createDefaultAdapter from '../internal/helpers/createDefaultAdapter'
import Props from './types/Props'
import Component from './types/Component'
import VirtualElement from './types/VirtualElement'

// --- createElement ------------------------------------------------

function createElement<P extends Props>(
  type: string | Component<P>, ...children: any[]): VirtualElement<P>

function createElement(/* arguments */): any {
  let ret: any

  const type: any = arguments[0]

  if (process.env.NODE_ENV === 'development' as any) {
    if (type && typeof type !== 'string'
      && adapter.type !== 'react'
      && type.meta && type.meta.validate)
    {
      const
        props: any = arguments[1] || {},
        validate: any = type.meta.validate,
        result = validate(props)


      let errorMsg: string | null  = null

      if (result === false) {
        errorMsg = 'Illegal props values'
      } else if (result instanceof Error) {
        errorMsg = result.message
      }

      if (errorMsg) {
        throw new Error(
          `Props validation error for component "${type.meta.displayName}" => `
            + errorMsg)
      }
    }
  }

  if (type === Fragment) {
    const
      fragment = adapter.Fragment,
      newArgs = [...arguments]

    newArgs[0] = fragment
    ret = adapter.createElement.apply(null, newArgs)
  } else if (type === Boundary) {
    const
      boundary = adapter.Boundary,
      newArgs = [...arguments]

    newArgs[0] = boundary
    ret = adapter.createElement.apply(null, newArgs)
  } else {
    ret = adapter.createElement.apply(null, arguments)
  }

  return ret
}

Object.defineProperty(createElement, '__adapter', {
  value: createDefaultAdapter()
})

// --- locals -------------------------------------------------------

const
  adapter = (createElement as any).__adapter

// --- exports ------------------------------------------------------

export default createElement