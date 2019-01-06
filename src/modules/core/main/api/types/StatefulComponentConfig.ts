import Props from './Props'
import Methods from './Methods'
import VirtualNode from '../types/VirtualNode'
import PropertiesConfig from './PropertiesConfig'
import Component from './Component'

export default interface StatelessComponentConfig<P extends Props = {}, M extends Methods = {}> {
  displayName: string,
  properties?: PropertiesConfig<P>,
  methods?: (keyof M)[],
  validate?: (props: P) => null | Error | true | false,
  init: ((self: Component<P>, ref?: any) => (props: P) => VirtualNode) | (() => any) // TODO
}
