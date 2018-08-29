import setJsSpecValidator from '../internal/helper/setJsSpecValidator'
import { isElement } from 'js-surface'

export default function isElementOfType(type, it) {
  let ret = null

  const
    typeOfType = typeof type,
    typeIsFunction = typeOfType === 'function',
    typeIsArray = Array.isArray(type)

  if (!typeIsFunction && !typeIsArray) {
    throw new TypeError(
      '[isElementOfType] First argument "type" must either be a function '
        + ' or an array of functions')
  }

  if (arguments.length > 1) {
    ret =
      typeof it === 'function'
        && isElement(it)
        && (typeIsFunction ? it.type === type : type.indexOf(it.type) >= 0)
  } else {
    ret = it => isElementOfType(type, it)
  
    setJsSpecValidator(ret, it =>
      isElementOfType(type, it)
        ? null
        : new Error('Invalid type of virtual element'))
  }

  return ret
}
