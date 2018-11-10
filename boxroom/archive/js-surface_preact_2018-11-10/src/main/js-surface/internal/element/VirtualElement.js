import { KEY_INTERNAL_TYPE } from '../constant/constants'
import { h } from 'preact'

const
  emptyArray = [],
  VNode = h('a').constructor,

  VirtualElement = {
    // we want to make sure that the classes name is really
    // "VirtualElement" even if minimized/uglified
    ['VirtualElement'](type, attrs, children) {
      const internalType = type[KEY_INTERNAL_TYPE] || type

      this.nodeName = internalType
      this.attributes = attrs || undefined
      this.children = children || emptyArray
      this.type = type
      this.key = !attrs ? undefined : attrs.key || undefined 
      this.ref = !attrs ? undefined : attrs.ref || undefined 
    }
  }.VirtualElement

VirtualElement.prototype = Object.create(VNode, {
  constructor: {
    value: VirtualElement
  },

  props: {
    enumerable: true,

    get() {
      let ret = null

      for (const attrName in this.attributes) {
        if (this.attributes.hasOwnProperty(attrName)) {
          ret = ret || {}
          ret[attrName] = this.attributes[attrName]
        }
      }

      if (ret) {
        delete ret.key
        delete ret.ref
      }

      if (this.children && this.children.length > 0) {
        ret = ret || {}
        ret.children = this.children
      }

      this.props = ret

      return ret
    },

    set(value) {
      Object.defineProperty(this, 'props', {
        enumerable: true,
        value: value
      })
    }
  }
})

export default VirtualElement
