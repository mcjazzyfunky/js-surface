// external imports
import Preact from 'preact'

// --- Boundary -----------------------------------------------------

class Boundary extends Preact.Component {
  componentDidCatch(error, info) {
    if (this.props.fallback) {
      this.props.fallback(error, info)
    }
  }

  render() {
    return this.props.children
  }
}

Boundary.displayName = 'Boundary (inner)'

Boundary.getDerivedStateFromError = () => {
}


// --- exports ------------------------------------------------------

export default Boundary
