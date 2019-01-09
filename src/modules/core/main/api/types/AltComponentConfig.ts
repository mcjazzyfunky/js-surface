import Props from './Props'
import Methods from './Methods'
import VirtualNode from '../types/VirtualNode'
import PropertiesConfig from './PropertiesConfig'
import Component from './Component'

type WithProperties<P extends Props = {}, M extends Methods = {}> = {
  displayName: string,
  properties?: PropertiesConfig<P>,
  defaultProps?: never, 
  methods?: (keyof M)[],
  validate?: (props: P) => null | Error | true | false,
  init: ((self: Component<P>, ref?: any) => (props: P) => VirtualNode) | (() => any) // TODO
}

type WithDefaultProps<P extends Props = {}, M extends Methods = {}> = {
  displayName: string,
  defaultProps?: Partial<P>,
  properties?: never,
  methods?: (keyof M)[],
  validate?: (props: P) => null | Error | true | false,
  init: ((self: Component<P>, ref?: any) => (props: P) => VirtualNode) | (() => any) // TODO
}

type ComponentConfig<P extends Props = {}, M extends Methods = {}> =
  WithProperties<P, M> | WithDefaultProps<P, M>

export default ComponentConfig
