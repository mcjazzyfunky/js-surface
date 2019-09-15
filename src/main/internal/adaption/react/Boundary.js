// external imports
import React from 'react'

// --- Boundary -----------------------------------------------------

class Boundary extends React.Component {
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
