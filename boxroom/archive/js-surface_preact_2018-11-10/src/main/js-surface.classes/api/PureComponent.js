import Component from './Component'

const PureComponent = function (props) {
  Component.call(this, props)
}

PureComponent.prototype = Object.create(Component.prototype)

PureComponent.prototype.shouldComponentUpdate =
  function (nextProps, nextState) {
    const equal =
      shallowEqual(nextProps, this.props)
        && shallowEqual(nextState, this.state)
    
    return !equal
  }

export default PureComponent

// --- locals -------------------------------------------------------

function shallowEqual(a, b) {
  let ret = true

  for (const key in a) {
    if (a[key] !== b[key]) {
      ret = false
      break
    }
  }

  if (ret) {
    for (const key in b) {
      if (!(key in a)) {
        ret = false
        break
      }
    }
  }

  return ret
}
