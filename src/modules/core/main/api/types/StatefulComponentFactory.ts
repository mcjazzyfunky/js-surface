import VirtualElement from './VirtualElement'
import StatefulComponentMeta from './StatefulComponentMeta'
import Props from './Props'
import Methods from './Methods'

export default interface StatefulComponentFactory<P extends Props = {}, M extends Methods = {}> {
  (props?: P, ...children: any[]): VirtualElement,
  meta: StatefulComponentMeta<P, M>
}
