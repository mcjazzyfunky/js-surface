import React from 'react'
import ReactDOM from 'react-dom'

// internal imports
import { createElement, Props } from '../../core/main/index'

import Adapter from '../../core/main/internal/types/Adapter'

const adapter: Adapter = (createElement as any).__adapter

const adapt: Adapter = {
  Boundary: ReactBoundary,
  Fragment: React.Fragment,

  childCount: React.Children.count,
  createElement: adjustedCreateElement,
  defineComponent: buildComponent,
  defineContext: buildContext,
  forEachChild: React.Children.forEach,
  useEffect: React.useEffect,
  useImperativeHandle: React.useImperativeHandle,
  useState: React.useState,
  isElement: React.isValidElement,
  mount: ReactDOM.render,
  unmount: ReactDOM.unmountComponentAtNode,
  propsOf: (it: any) => React.isValidElement(it) ? it.props : null,
  typeOf: (it: any) => React.isValidElement(it) ? it.type : null,
  toChildArray: React.Children.toArray,
  useCallback: React.useCallback,
  useContext: React.useContext,
  useRef: React.useRef
}

Object.assign(adapter, adapt)

// --- locals -------------------------------------------------------

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

function buildComponent<P extends Props = {}>(
  displayName: string,
  renderer: (props: P) => any,
  memoize?: boolean,
  validate?: (props: P) => boolean | null | Error
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

function ReactBoundary() {
}

const proto = Object.create(React.Component.prototype)
ReactBoundary.prototype = proto

ReactBoundary.displayName = 'Boundary (inner)'
ReactBoundary.getDerivedStateFromError = () => {}

proto.componentDidCatch = function (error: any, info: any) {
  if (this.props.handle) {
    this.props.handle(error, info)
  }
}

proto.render = function () {
 return this.props.children
}
