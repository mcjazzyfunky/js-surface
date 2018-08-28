import Platform from './internal/platform/Platform'
import createElement from './api/createElement'
import createPortal from './api/createPortal'
import defineComponent from './api/defineComponent'
import defineContext from './api/defineContext'
import isElement from './api/isElement'
import isNode from './api/isNode'
import mount from './api/mount'
import unmount from './api/unmount'
import Fragment from './api/Fragment'

import preact from 'preact'
import preactContext from 'preact-context'

const VNode = preact.h('a', null).constructor

Platform.createElement = preact.createElement
Platform.isValidElement = it => it instanceof VNode 
Platform.createContext = preactContext.createContext
Platform.createPortal = null // TODO
Platform.forwardRef = preact.forwardRef
Platform.Component = preact.Component

Platform.render = preact.render
Platform.unmoundComponentAtNode = preact.unmoundComponentAtNode

Platform.isContext = it => !!it && typeof it === 'object'
  && !!it.Provider && !!it.Consumer

export {
  createElement,
  createPortal,
  defineComponent,
  defineContext,
  isElement,
  isNode,
  mount,
  unmount,
  Fragment
}
