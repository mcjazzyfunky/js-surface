import React from 'react'

export default {
  typeOf(elem) {
    let ret

    if (React.isValidElement(elem)) {
      ret = elem.type
    }

    return ret
  },

  propsOf(elem) {
    let ret

    if (React.isValidElement(elem)) {
      ret = elem.props
    }

    return ret
  }
}
