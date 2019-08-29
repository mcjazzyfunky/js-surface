import Props from './Props'
import VirtualNode from './VirtualNode'
import PropertiesConfig from './PropertiesConfig'

type WithProperties<P extends Props = {}> = {
  displayName: string,
  properties?: PropertiesConfig<P>,
  defaultProps?: never,
  validate?: (props: P) => null | Error | true | false,
  memoize?: boolean,
  render: (props: P, ref?: any) => VirtualNode
}

type WithDefaultProps<P extends Props = {}> = {
  displayName: string,
  properties?: never,
  defaultProps?: Partial<P>,
  validate?: (props: P) => null | Error | true | false,
  memoize?: boolean,
  render: (props: P, ref?: any) => VirtualNode
}

type ComponentConfig<P extends Props = {}>
  = WithProperties<P> | WithDefaultProps<P> 

export default ComponentConfig
