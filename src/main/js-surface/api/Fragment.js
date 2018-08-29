import createElement from './createElement'

export default function Fragment(...args) {
  return createElement(Fragment, ...args)
}

Fragment.__internal_type = 'span' // TODO
