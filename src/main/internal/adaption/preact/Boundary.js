// external imports
import Preact from 'preact'

// --- Boundary -----------------------------------------------------

class Boundary extends Preact.Component {
  componentDidCatch(error, info) {console.log(111111)
    if (this.props.fallback) {
      this.props.fallback(error, info)
    }
  }

  render() {
    return this.props.children
  }
}

Boundary.displayName = 'Boundary (inner)'

// --- exports ------------------------------------------------------

export default Boundary
