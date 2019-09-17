import { isValidElement } from 'preact'

export default {
  typeOf(elem) {
    let ret

    if (isValidElement(elem)) {
      ret = elem.type
    }

    return ret
  },

  propsOf(elem) {
    let ret

    if (isValidElement(elem)) {
      ret = elem.props
    }

    return ret
  }
}
