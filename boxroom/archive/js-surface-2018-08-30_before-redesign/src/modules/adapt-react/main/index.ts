import React from 'react'
import ReactDOM from 'react-dom'

import {
  childCount,
  createElement, defineComponent, defineContext, isElement,
  mount, unmount,
  typeOf, propsOf, toChildArray, forEachChild,
  useContext, useEffect, useMethods, useState,
  Fragment, Boundary, Props, Context,
} from '../../core/main/index'

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

  return React.createElement.apply(null, args)
}

adapt(createElement, adjustedCreateElement)
adapt(isElement, React.isValidElement)
adapt(childCount, React.Children)

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
    ret = React.memo(ret)
  }

  ret.displayName = factory.meta.displayName

  if (factory.meta.render.length > 1) {
    ret = React.forwardRef(ret)
  }

  return ret
})

adapt(defineContext, (ctx: Context<any>, meta: any) => {
  const internalContext = React.createContext(meta.defaultValue)

  return [internalContext, internalContext.Provider, internalContext.Consumer]
})

adapt(useContext, (ctx: any) => {
  return React.useContext(ctx.Provider.__internal_type._context)
})

adapt(typeOf, (it: any) => it.type) 
adapt(propsOf, (it: any) => it.type)
adapt(toChildArray, React.Children.toArray) 
adapt(forEachChild, React.Children.forEach)

adapt(useEffect, React.useEffect)
adapt(useMethods, React.useImperativeHandle)
adapt(useState, React.useState)

adapt(mount, ReactDOM.render)
adapt(unmount, ReactDOM.unmountComponentAtNode)

adapt(Boundary, (props: any) => {
  return (
    React.createElement(
      ReactBoundary,
      { handle: props.handle },
      props.children)
  )
})

Object.defineProperty(Fragment, '__internal_type', {
  value: React.Fragment
})

class ReactBoundary extends React.Component {
  static displayName = 'Boundary (inner)'

  static getDerivedStateFromError() {
  }

  componentDidCatch(error: any, info: any) {
    if (this.props.handle) {
      this.props.handle(error, info)
    }
  }

  render() {
    return this.props.children
  }
}
