import Props from './Props'
import PropertyConfig from './PropertyConfig'

type PropertiesConfig<P extends Props> = {
  [propName in keyof P]: PropertyConfig<P[propName]>
}

export default PropertiesConfig
