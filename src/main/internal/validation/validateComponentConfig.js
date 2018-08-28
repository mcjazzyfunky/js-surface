import configSpec from '../spec/specOfComponentConfig'

export default function validateComponentConfig(config) {
  let ret = null

  if (config === null || typeof config !== 'object') {
    ret = new TypeError('Component configuration must be an object')
  } else {
    ret = configSpec.validate(config)
  }

  return ret
}
