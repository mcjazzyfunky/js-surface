import Props from './Props'
import Methods from './Methods'
import PropertiesConfig from './PropertiesConfig'
import VirtualElement from './VirtualElement'
import Component from './Component'

export default interface StatelessComponentMeta<P extends Props = {}, M extends Methods = {}> {
  displayName: string,
  properties?: PropertiesConfig<P>
  methods?: (keyof M)[]
  init: (self: Component) => () => VirtualElement
}