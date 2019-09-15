// external import
import Preact from 'preact'

// --- createElement ------------------------------------------------

function createElement(/* arguments */) {
  const args = arguments

  if (args.length > 1) {
    const
      type = args[0],
      props = args[1]

    if (typeof type === 'string' && props && props.innerHTML) {
      args[1] = Object.assign({}, props, { dangerouslySetInnerHTML: {__html: props.innerHTML } })
      delete args[1].innerHTML
    }
  }

  return Preact.createElement.apply(null, args)
}

// --- externals ----------------------------------------------------

export default createElement
