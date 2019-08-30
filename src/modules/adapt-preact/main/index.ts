/*
import * as Preact from 'preact'
import * as Hooks from 'preact/hooks'

import {
  childCount,
  createElement, defineComponent, defineContext, isElement,
  mount, unmount,
  typeOf, propsOf, toChildArray, forEachChild,
  useContext, useEffect, useMethods, useState,
  Fragment, Boundary, Props, Context,
} from '../../core/main/index'

// TODO!!!
function adjustedUseMethods(ref: any, getHandler: Function) {
  const handler = getHandler() // TODO

  if (ref && typeof ref === 'object') {
    ref.current = handler
  } else if (typeof ref === 'function') {
    ref(handler)
  }
}

function adapt(base: any, delegate: any) {
  Object.defineProperty(base, '__apply', {
    value: delegate
  })
}

function adjustedCreateElement(/* arguments */) {
  const args = arguments
  if (args.length > 1) {
    const
      type = args[0],
      props = args[1]

    if (typeof type === 'string' && props && props.innerHTML) {
      args[1] = { ...props, dangerouslySetInnerHTML: {__html: props.innerHTML } }
      delete args[1].innerHTML
    }
  }

  return Preact.createElement.apply(null, args)
}

adapt(createElement, adjustedCreateElement)
adapt(isElement, (it: any) => !!it && it.type && it.props)
adapt(childCount,  (children: any) => Preact.toChildArray(children).length)

adapt(defineComponent, (factory: any) => {
  const
     defaultProps = factory.meta.defaultProps

  let ret: any = (props: Props, ref: any) => {
    if (defaultProps) {
      props = Object.assign({}, defaultProps, props) // TODO - performance
    }

    return factory.meta.render(props, ref)
  }

  if (factory.meta.memoize) {
    ret = (ret) // TODO: memo
  }

  ret.displayName = factory.meta.displayName

  return ret
})

adapt(defineContext, (ctx: Context<any>, meta: any) => {
  const internalContext: any = Preact.createContext(meta.defaultValue)

  internalContext.Provider._context = internalContext


  return [internalContext, internalContext.Provider, internalContext.Consumer]
})

adapt(useContext, (ctx: any) => {
  return Hooks.useContext(ctx.Provider.__internal_type._context)
})

adapt(typeOf, (it: any) => it.type) 
adapt(propsOf, (it: any) => it.type)
adapt(toChildArray, Preact.toChildArray) 
adapt(forEachChild, (children: any, action: any) => Preact.toChildArray(children).forEach((it, idx) => action(it, idx)))

adapt(useEffect, Hooks.useEffect)
adapt(useMethods, adjustedUseMethods)
adapt(useState, Hooks.useState)

adapt(mount, Preact.render)
adapt(unmount, (container: any) => Preact.render(null, container))

adapt(Boundary, (props: any) => {
  return (
    Preact.createElement(
      PreactBoundary as any,
      { handle: props.handle },
      props.children)
  )
})

Object.defineProperty(Fragment, '__internal_type', {
  value: Preact.Fragment
})

class PreactBoundary extends Preact.Component {
  static displayName = 'Boundary (inner)'

  componentDidCatch(error: any) {
    const handle = (this.props as any).handle
    
    if (handle) {
      handle(error, null)
    }
  }

  render() {
    return this.props.children
  }
}
*/