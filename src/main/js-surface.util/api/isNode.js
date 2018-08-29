import isElement from 'js-surface'

export default function isNode(it) {
  return !it || typeof it !== 'object' || isElement(it) 
    || typeof it[Symbol.iterator] === 'function'
}
