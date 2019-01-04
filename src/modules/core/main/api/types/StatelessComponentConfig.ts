import Props from './Props'
import VirtualNode from './VirtualNode'
import PropertiesConfig from './PropertiesConfig'

export default interface StatelessComponentConfig<P extends Props = {}> {
  displayName: string,
  properties?: PropertiesConfig<P>,
  validate?: (props: P) => null | Error | true | false,
  render: (props: P, ref?: any) => VirtualNode
}
