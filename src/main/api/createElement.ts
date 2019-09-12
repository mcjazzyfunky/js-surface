// internal imports
import _createElement from '../internal/adaption/dyo/createElement'
import Boundary from './Boundary'
import Fragment from './Fragment'
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
      //&& adapter.type !== 'react' // TODO!!!!
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

  ret = _createElement.apply(null, arguments)

  return ret
}

// --- exports ------------------------------------------------------

export default createElement