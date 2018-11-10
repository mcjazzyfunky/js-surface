import { KEY_INTERNAL_TYPE } from '../internal/constant/constants'
import createElement from './createElement'

let createFragmentElement = null // will be set below

export default function Fragment(/* arguments */) {
  createFragmentElement =
    createFragmentElement || createElement.bind(null, Fragment)

  return createFragmentElement.apply(null, arguments)
}

Fragment[KEY_INTERNAL_TYPE] = 'x-fragment' // TODO
