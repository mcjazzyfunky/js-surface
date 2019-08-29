import Props from './Props'
import PropertiesConfig from './PropertiesConfig'
import VirtualElement from './VirtualElement'

export default interface ComponentMeta<P extends Props> {
  displayName: string,
  properties?: PropertiesConfig<P>
  validate?: (props: P) => null | Error | true | false,
  memoize?: boolean,
  render: (props: P) => VirtualElement
}
