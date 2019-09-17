import { isValidElement } from 'dyo'

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
      ret = !elem.children
        ? elem.props
        : Object.assign({ children: elem.children }, elem.props)
    }

    return ret
  }
}
