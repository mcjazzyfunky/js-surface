import VirtualElement from './VirtualElement'
import StatelessComponentMeta from './StatefulComponentMeta'
import Props from './Props'

export default interface StatelessComponentFactory<P extends Props = {}> {
  (props?: P, ...children: any[]): VirtualElement,
  meta: StatelessComponentMeta
}
