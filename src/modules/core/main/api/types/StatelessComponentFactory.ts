import VirtualElement from './VirtualElement'
import StatelessComponentMeta from './StatefulComponentMeta'
import Props from './Props'

type ExtProps<P extends Props> = P & {
  key?: string | number,
  ref?: any // TODO
}

export default interface StatelessComponentFactory<P extends Props = {}> {
  (props?: ExtProps<P>, ...children: any[]): VirtualElement,
  meta: StatelessComponentMeta
}
