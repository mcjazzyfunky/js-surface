import * as Preact from 'preact'
import { forwardRef as preactForwardRef } from 'preact/compat'
import { useEffect, useRef, useCallback, useImperativeHandle, useState, useContext } from 'preact/hooks'

// internal imports
import { createElement, Children, Props, VirtualNode } from '../../core/main/index'

import Adapter from '../../core/main/internal/types/Adapter'

const adapter: Adapter = (createElement as any).__adapter

const adapt: Adapter = {
  type: 'preact',
  Boundary: PreactBoundary,
  Fragment: Preact.Fragment,

  childCount: (children: Children) => Preact.toChildArray(children).length,
  createElement: adjustedCreateElement,
  defineComponent: buildComponent,
  defineContext: buildContext,
  forEachChild: (children: Children, action: (child: VirtualNode, index: number) => void) => Preact.toChildArray(children).forEach(action as any), // TODO 
  useEffect,
  useImperativeHandle: useImperativeHandle,
  useState,
  isElement: Preact.isValidElement,
  mount: Preact.render,
  unmount: Preact.render.bind(null, null),
  propsOf: (it: any) => Preact.isValidElement(it) ? it.props as any : null, // TODO
  typeOf: (it: any) => Preact.isValidElement(it) ? it.type as any : null, // TODO
  toChildArray: Preact.toChildArray as any, // TODO
  useCallback,
  useContext,
  useRef
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

  return Preact.createElement.apply(null, args)
}

function buildComponent<P extends Props = {}>(
  displayName: string,
  renderer: (props: P) => any,
  forwardRef: boolean,
  memoize: boolean,
  validate: (props: P) => boolean | null | Error
): any {
  let ret: any
  
  if (!forwardRef) {
    ret = renderer.bind(null)
  }  else {
    ret = function (props: any, ref: any) {
      if (ref !== undefined) {
        props = { ...props, ref }
      }

      return renderer(props)
    }
  }

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

  if (forwardRef) {
    ret = preactForwardRef(ret)
  }

  if (memoize === true) {
    // ret = Preact.memo(ret) // TODO!!!!!!!
  }

  return ret
}

function buildContext<T>(
  displayName: string,
  defaultValue: T,
  validate: (value: T) => boolean | null | Error
) { 
  const
    ret = Preact.createContext(defaultValue),
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

function PreactBoundary() {
}

const proto = Object.create(Preact.Component.prototype)
PreactBoundary.prototype = proto

PreactBoundary.displayName = 'Boundary (inner)'
PreactBoundary.getDerivedStateFromError = () => {}

proto.componentDidCatch = function (error: any, info: any) {
  if (this.props.handle) {
    this.props.handle(error, info)
  }
}

proto.render = function () {
 return this.props.children
}
