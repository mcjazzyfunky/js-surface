import Props from './Props'
import PropertiesConfig from './PropertiesConfig'
import VirtualElement from './VirtualElement'

export default interface StatelessComponentMeta<P extends Props> {
  displayName: string,
  properties?: PropertiesConfig<P>
  render: (props: P) => VirtualElement
}