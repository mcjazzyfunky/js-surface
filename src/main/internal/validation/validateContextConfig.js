import configSpec from '../spec/specOfContextConfig'

export default function validateContextConfig(config) {
  let ret = null

  if (config !== undefined && (config === null || typeof config !== 'object')) {
    ret = 'Context configuration must be an object or undefined'
  } else {
    ret = configSpec.validate(config)
  }

  return ret
}
