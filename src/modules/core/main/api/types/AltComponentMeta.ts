import Props from './Props'
import Methods from './Methods'
import PropertiesConfig from './PropertiesConfig'
import VirtualElement from './VirtualElement'
import Component from './Component'

export default interface ComponentMeta<P extends Props = {}, M extends Methods = {}> {
  displayName: string,
  properties?: PropertiesConfig<P>
  validate?: (props: P) => null | Error | true | false,
  methods?: (keyof M)[]
  init: (self: Component) => () => VirtualElement
}