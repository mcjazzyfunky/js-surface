// external imports
import * as Dyo from 'dyo'

// internal imports
import { createElement, Props } from '../../core/main/index'

import Adapter from '../../core/main/internal/types/Adapter'

const adapter: Adapter = (createElement as any).__adapter

const adapt: Adapter = {
  type: 'dyo',
  Boundary: DyoBoundary,
  Fragment: Dyo.Fragment,

  childCount: Dyo.Children.count,
  createElement: adjustedCreateElement,
  defineComponent: buildComponent,
  defineContext: buildContext,
  forEachChild: Dyo.Children.forEach,
  useEffect: Dyo.useEffect,
  useImperativeHandle: useDyoImperativeHandle,
  useState: Dyo.useState,
  isElement: Dyo.isValidElement,
  mount: Dyo.render,
  unmount: Dyo.render.bind(null, null),
  propsOf: (it: any) => Dyo.isValidElement(it) ? it.props : null,
  typeOf: (it: any) => Dyo.isValidElement(it) ? it.type : null,
  toChildArray: Dyo.Children.toArray,
  useCallback: Dyo.useCallback,
  useContext: useDyoContext,
  useRef: Dyo.useRef
}

Object.assign(adapter, adapt)

// --- locals -------------------------------------------------------

function adjustedCreateElement(/* arguments */) {
  // TODO
  return Dyo.createElement.apply(null, arguments)
}

function buildComponent<P extends Props = {}>(
  displayName: string,
  renderer: (props: P) => any,
  forwardRef: boolean,
  memoize: boolean,
  validate: (props: P) => boolean | null | Error
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

  const Consumer: (x: any) => any = (props: any) => {
    // There's a but in Dyo => filter children
    const nodes = Dyo.Children.toArray(props.children).filter((it: any) => it !== null)
    let value = Dyo.useContext(ret)

    if (value === undefined) {
      value = defaultValue
    }

    return nodes.length > 0 ? nodes[0](value) : null
  }
  
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

  return Dyo.h(Dyo.Boundary, { fallback }, children)
}

function useDyoImperativeHandle(ref: any, getHandler: Function) {
  const handler = getHandler() // TODO

  if (ref && typeof ref === 'object') {
    ref.current = handler
  } else if (typeof ref === 'function') {
    ref(handler)
  }
}
