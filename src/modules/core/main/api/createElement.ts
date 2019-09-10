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

  if (arguments[0] === Fragment) {
    const
      fragment = adapter.Fragment,
      newArgs = [...arguments]

    newArgs[0] = fragment
    ret = adapter.createElement.apply(null, newArgs)
  } else if (arguments[0] === Boundary) {
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

const adapter = (createElement as any).__adapter

// --- exports ------------------------------------------------------

export default createElement