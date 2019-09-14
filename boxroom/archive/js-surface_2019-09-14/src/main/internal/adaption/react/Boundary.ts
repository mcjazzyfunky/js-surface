// external imports
import React from 'react'

// --- Boundary -----------------------------------------------------

class Boundary extends React.Component {
  static displayName: string = 'Boundary (inner)'

  static getDerivedStateFromError() {
  }

  componentDidCatch(error: any, info: any) { // TODO
    if (this.props.fallback) {
      this.props.fallback(error, info)
    }
  }

  render() {
    return this.props.children
  }
}

// --- exports ------------------------------------------------------

export default Boundary
