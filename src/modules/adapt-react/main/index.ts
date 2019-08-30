import React from 'react'
import ReactDOM from 'react-dom'

import {
  childCount,
  createElement, component, context, isElement,
  mount, unmount,
  typeOf, propsOf, toChildArray, forEachChild,
  useCallback, useContext, useEffect, useImperativeMethods, useRef, useState,
  Fragment, Props
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
adapt(component, buildComponent)
adapt(context, buildContext) 

adapt(useCallback, React.useCallback)
adapt(useContext, React.useContext) 

adapt(typeOf, (it: any) => it.type) 
adapt(propsOf, (it: any) => it.type)
adapt(toChildArray, React.Children.toArray) 
// adapt(forEachChild, React.Children.forEach) // TODO

adapt(useEffect, React.useEffect)
adapt(useImperativeMethods, React.useImperativeHandle)
adapt(useState, React.useState)
adapt(useRef, React.useRef)

adapt(mount, ReactDOM.render)
adapt(unmount, ReactDOM.unmountComponentAtNode)

Object.defineProperty(createElement, '__boundary', {
  get: () => ReactBoundary
})

Object.defineProperty(createElement, '__fragment', {
  value: React.Fragment
})

// --- locals -------------------------------------------------------

function buildComponent<P extends Props = {}>(
  displayName: string,
  renderer: (props: P) => any,
  validate?: (props: P) => boolean | null | Error, 
  memoize?: boolean
): any {
  let ret: any = renderer.bind(null)
  ret.displayName = displayName

  if (validate) {
    ret.propTypes = {
      '*'(props: any) {
        const
          result = validate(props),

          errorMsg =
            result === false
              ? 'Invalid value'
              : result instanceof Error
                ? result.message
                : null

        return !errorMsg
          ? null
          : new TypeError(
            'Props validation error for component '
            + `"${displayName}" => ${errorMsg}`)
      }
    }
  }

  if (memoize === true) {
    ret = React.memo(ret)
  }

  return ret
}

function buildContext<T>(
  displayName: string,
  defaultValue: T,
  validate: (value: T) => boolean | null | Error
) { 
  const
    ret = React.createContext(defaultValue),
    provider: any = ret.Provider

  provider.displayName = displayName

  if (validate) {
    provider.propTypes = {
      value: (props: any) => {
        const
          result = validate(props.value),

          errorMsg =
            result === false
              ? 'Invalid value'
              : result instanceof Error
                ? result.message
                : null

        return !errorMsg
          ? null
          : new TypeError(
            'Validation error for provider of context '
            + `"${displayName}" => ${errorMsg}`)
      }
    }
  }

  return ret
}

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
