import { h } from 'preact'

const
  VNode = h('a').constructor,

  VirtualElement = {
    ['VirtualElement'](type, props) {
      initVirtualElement(this, type, props)
    }
  }.VirtualElement

VirtualElement.prototype = Object.create(VNode.prototype, {
  nodeName: {
    enumerable: false,

    get: function () {
      return this.internal.nodeName
    }
  },

  attributes: {
    enumerable: false,

    get: function () {
      return this.internal.attributes
    }
  },

  children: {
    enumerable: false,

    get: function () {
      return this.internal.children
    }
  }
})

export default VirtualElement

// --- locals -------------------------------------------------------

function initVirtualElement(elem, type, props) {
  const
    internalType = type.__internal_type || type,
    vnode = h(internalType, props),
    
    internal = {
      nodeName: vnode.nodeName,
      attributes: vnode.attributes,
      children: vnode.children
    }

  Object.defineProperty(elem, 'internal', {
    enumerable: false,
    value: internal
  })

  elem.type = type
  elem.key = !props ? null : props.key || null
  elem.ref = !props ? null : props.ref || null
  elem.props =  props

  if (props && (props.key || props.ref)) {
    elem.props = Object.assign({}, props) 
    delete elem.props.key
    delete elem.props.ref

    if (props.ref) {
      const ref = props.ref
      const preactRef = it => {
        let proxy = it && it.__proxy

        ref(proxy || it)
      }

      props.ref = preactRef
    }
  }
}
