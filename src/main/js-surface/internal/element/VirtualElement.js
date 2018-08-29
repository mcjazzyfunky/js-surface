import { h } from 'preact'

const
  emptyArray = [],
  VNode = h('a').constructor,

  VirtualElement = {
    ['VirtualElement'](type, attrs, children) {
      const internalType = type.__internal_type || type

      this.nodeName = internalType
      this.attributes = attrs || undefined
      this.children = children || emptyArray
      this.type = type
      this.key = !attrs ? undefined : attrs.key || undefined 
      this.ref = !attrs ? undefined : attrs.ref || undefined 
    }
  }.VirtualElement

VirtualElement.prototype = Object.create(VNode, {
  props: {
    enumerable: true,

    get() {
      let ret = this.props2

      if (ret === undefined) {
        const ret = {}

        for (const attrName in this.attributes) {
          if (this.attributes.hasOwnProperty(attrName)) {
            ret[attrName] = this.attributes.attrName
          }
        }

        delete ret.key
        delete ret.ref

        if (this.children && this.children.length > 0) {
          ret.children = this.children
        }

        this.props2 = ret
      }

      return ret
    },

    set(value) {
      this.props2 = value || null
    }
  }
})

export default VirtualElement
