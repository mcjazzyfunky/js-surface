// external imports
import React from 'react'

// --- Boundary -----------------------------------------------------

function Boundary() {
}

const proto = Object.create(React.Component.prototype)
Boundary.prototype = proto

Boundary.displayName = 'Boundary (inner)'

Boundary.getDerivedStateFromError = function () {
}

proto.componentDidCatch = function (error: any, info: any) {
  if (this.props.handle) {
    this.props.handle(error, info)
  }
}

proto.render = function () {
 return this.props.children
}

// --- exports ------------------------------------------------------

export default Boundary
