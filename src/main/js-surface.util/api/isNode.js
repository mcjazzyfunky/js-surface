import setJsSpecValidator from '../internal/setJsSpecValidator'
import isElement from 'js-surface'

export default function isNode(it) {
  return !it || typeof it !== 'object' || isElement(it) 
    || typeof it[Symbol.iterator] === 'function'
}

setJsSpecValidator(isNode, it =>
  isNode(it)
    ? null
    : new Error('Invalid type of virtual node'))
