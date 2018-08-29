import { h } from 'preact'

const
  VNode = h('a').constructor,

  VirtualElement = {
    ['VirtualElement'](type, props) {
      initVirtualElement(this, type, props)
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

// --- locals -------------------------------------------------------

function initVirtualElement(elem, type, attrs) {
  const internalType = type.__internal_type || type

  elem.nodeName = internalType
  elem.attributes = attrs || undefined
  elem.children = attrs ? attrs.children || [] : [] 
  elem.type = type
  elem.key = !attrs ? null : attrs.key || null 
  elem.ref = !attrs ? null : attrs.ref || null 

  attrs && delete attrs.children

  if (attrs && attrs.ref) {
    if (attrs.ref) {
      const ref = attrs.ref

      const preactRef = it => {
        let proxy = it && it.__proxy

        ref(proxy || it)
      }

      attrs.ref = preactRef
    }
  }

  // console.log(elem)
}
