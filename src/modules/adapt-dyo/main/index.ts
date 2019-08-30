import * as Dyo from 'dyo'

import {
  childCount,
  createElement, component, context, isElement,
  mount, unmount,
  typeOf, propsOf, toChildArray, forEachChild,
  useCallback, useContext, useEffect, useImperativeMethods, useRef, useState,
  Props
} from '../../core/main/index'

const h = Dyo.createElement

adapt(createElement, adjustedCreateElement)
adapt(isElement, Dyo.isValidElement)
adapt(childCount, Dyo.Children.count)
adapt(component, buildComponent)
adapt(context, buildContext) 
adapt(useCallback, Dyo.useCallback)
adapt(useContext, useDyoContext) 
adapt(typeOf, (it: any) => it.type) 
adapt(propsOf, (it: any) => it.props)
adapt(toChildArray, Dyo.Children.toArray) 
// adapt(forEachChild, React.Children.forEach) // TODO
adapt(useEffect, Dyo.useEffect)
adapt(useImperativeMethods, useDyoImperativeMethods)
adapt(useState, Dyo.useState)
adapt(useRef, Dyo.useRef)
adapt(mount, Dyo.render)
adapt(unmount, Dyo.unmountComponentAtNode)
adapt(createElement, DyoBoundary, '__boundary')
adapt(createElement, Dyo.Fragment, '__fragment')

// --- locals -------------------------------------------------------

function adapt(target: any, value: any, key = '__apply') {
  Object.defineProperty(target, key, {
    value: value
  })
}

function adjustedCreateElement(/* arguments */) {
  // TODO
  return Dyo.createElement.apply(null, arguments)
}

function buildComponent<P extends Props = {}>(
  displayName: string,
  renderer: (props: P) => any,
  validate?: (props: P) => boolean | null | Error, 
  memoize?: boolean
): any {
  let ret: any = renderer.bind(null)
  ret.displayName = displayName

  if (validate) {
    ret.validate = validate
  }

  if (memoize === true) {
    ret = Dyo.memo(ret)
  }

  return ret
}

function buildContext<T>(
  displayName: string,
  defaultValue: T,
  validate: (value: T) => boolean | null | Error
) {
  const DyoContext = Dyo.Context

  const Provider = ({ value, children }: any) =>
    Dyo.createElement(DyoContext, { value }, children)

  // TODO Consumer!!!
  const Consumer: any = null
  
  const constr: any = () => {}

  constr.__defaultValue = defaultValue

  const ret: any = Object.create(constr.prototype)

  ret.Provider = Provider
  ret.Consumer = Consumer

  Provider.displayName = displayName

  if (validate) {
    Provider.validate = validate
  }

  return ret
}

function useDyoContext(ctx: any): any {
  let ret = Dyo.useContext(ctx.Provider)

  if (ret === undefined) {
    ret = ctx.constructor.__defaultValue
  }

  return ret
}

function DyoBoundary({ handle, children }: any) {
  function fallback(error: any): any {
    handle(error.message, null)
    return null
  }

  return h(Dyo.Boundary, { fallback }, children)
}

function useDyoImperativeMethods(ref: any, getHandler: Function) {
  const handler = getHandler() // TODO

  if (ref && typeof ref === 'object') {
    ref.current = handler
  } else if (typeof ref === 'function') {
    ref(handler)
  }
}
