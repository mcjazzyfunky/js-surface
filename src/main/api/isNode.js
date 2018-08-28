import Platform from '../internal/platform/Platform'

export default function isNode(it) {
  return !it || typeof it !== 'object' || Platform.isValidElement(it)
    || typeof it[Symbol.iterator] === 'function'
}