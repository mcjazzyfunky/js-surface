// external import
import React from 'react'

// --- createElement ------------------------------------------------

function createElement(/* arguments */) {
  const args = arguments

  if (args.length > 1) {
    const
      type = args[0],
      props = args[1]

    if (typeof type === 'string' && props && props.innerHTML) {
      args[1] = { ...props, dangerouslySetInnerHTML: {__html: props.innerHTML } }
      delete args[1].innerHTML
    }
  }

  return React.createElement.apply(null, args)
}

// --- externals ----------------------------------------------------

export default createElement
