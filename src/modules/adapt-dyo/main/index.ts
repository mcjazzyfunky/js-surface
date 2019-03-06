import Dyo from 'dyo'

import {
  childCount,
  createElement, defineComponent, defineContext, isElement,
  mount, unmount,
  typeOf, propsOf, toChildArray, forEachChild,
  useContext, useEffect, useMethods, useState,
  Fragment, Props, Context,
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

adapt(createElement, Dyo.createElement)
adapt(isElement, Dyo.isValidElement)
adapt(childCount, Dyo.Children)

adapt(defineComponent, (factory: any) => {
  const
     defaultProps = factory.meta.defaultProps

  let ret = (props: Props, ref: any) => {
    if (defaultProps) {
      props = Object.assign({}, defaultProps, props) // TODO - performance
    }

    return factory.meta.render(props, ref)
  }

  if (factory.meta.render.length > 1) {
    const oldRet = ret

    ret = (props: any) => oldRet(props, props ? props.ref : undefined)
  }

  return ret
})

adapt(defineContext, (ctx: Context<any>, meta: any) => { // TODO
  const internalContext = Dyo.createContext(meta.defaultValue)

  Object.defineProperty(ctx.Provider, '__internal_context', {
    value: internalContext
  })

  // TODO
  function Provider(props: any) {
    Dyo.useContext(internalContext)[1](props.value)

    return props.children
  }

  // TODO
  function Consumer(props: any) {
    const [value] = Dyo.useContext(internalContext)

    return props.children[0](value)
  }

  return [internalContext, Provider, Consumer]
})


adapt(useContext, (ctx: any) => {
  return Dyo.useContext(ctx.Provider.__internal_context)[0]
})

adapt(typeOf, (it: any) => it.type) 
adapt(propsOf, (it: any) => it.type)
adapt(toChildArray, Dyo.Children.toArray) 
adapt(forEachChild, Dyo.Children.forEach)

adapt(useEffect, Dyo.useEffect)
adapt(useMethods, adjustedUseMethods)
adapt(useState, Dyo.useState)

adapt(mount, Dyo.render)
adapt(unmount, Dyo.unmountComponentAtNode)

Object.defineProperty(Fragment, '__internal_type', {
  value: Dyo.Fragment
})
